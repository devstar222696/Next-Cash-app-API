import User from '@/models/User';
import dbConnect from '@/lib/dbConnect';
import { NextRequest, NextResponse } from 'next/server';
import { formatInTimeZone } from 'date-fns-tz';

export const POST = async (request: NextRequest) => {
  const { token, paymentoption, paymenttype, amount, id, btc, isChecked } =
    await request.json();
  await dbConnect();

  try {
    // Find the user by the token
    const user = await User.findOne({ token: token });

    if (user) {
      const date = new Date();
      const timeZone = 'Pacific/Honolulu'; // HST timezone identifier

      const convertDate = formatInTimeZone(date, timeZone, 'yyyy-MM-dd HH:mm:ss')
      const finalDate = convertDate.split(' ')[0]+'T'+convertDate.split(' ')[1]+'.000Z'

      if(isChecked) {
        const lastBonus = user.redeem.find((redeem: any) => {
          return (
            redeem.dailyChecked &&
            new Date(finalDate) > new Date(redeem.isBonusInitializeTime)
          );
        });
        if (lastBonus) {
          return NextResponse.json(
            { error: 'Bonus already used today' },
            { status: 400 }
          );
        }
      }
      // Add new redeem information to the existing redeems array
      user.redeem.push({
        amount: amount,
        btc: btc,
        paymentoption: paymentoption,
        paymenttype: paymenttype,
        id: id,
        dailyChecked: isChecked !== undefined ? isChecked : false
      });

      try {
        // Save the updated user document
        await user.save();

        return NextResponse.json(
          {
            ok: 'redeem added successfully'
          },
          { status: 200 }
        ); // Return success with a 200 status
      } catch (err: any) {
        return NextResponse.json(
          { error: 'Failed to save updated user' },
          { status: 500 }
        );
      }
    } else {
      return NextResponse.json({ error: 'User not found' }, { status: 404 }); // Return not found
    }
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
};
