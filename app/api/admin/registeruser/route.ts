import User from '@/models/User';
import dbConnect from '@/lib/dbConnect';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (request: NextRequest) => {
  const { loginid, id, passwordcode, category } = await request.json();


  if (!loginid || !passwordcode || !category || !id) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }

  await dbConnect();

  try {
    // Find the user by the token
    const existingUser = await User.findById(id);

    if (existingUser) {
      // Add new redeem information to the existing redeems array
      existingUser.register.push({
        loginid: loginid,
        passwordcode: passwordcode,
        category: category,
        status: 'complete',
        id: id
      });

      try {
        // Save the updated user document
        await existingUser.save();

        return NextResponse.json(
          {
            ok: 'Register request added successfully'
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
