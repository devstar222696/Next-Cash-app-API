import User from '@/models/User';
import dbConnect from '@/lib/dbConnect';
import { NextRequest, NextResponse } from 'next/server';
import {
  getCurrentHSTUTCDate,
  getDailyCheckedRecords,
  getVipFreePlayRecords
} from '@/lib/utils';

export const POST = async (request: NextRequest) => {
  const {
    token,
    paymentoption,
    paymenttype,
    amount,
    id,
    btc,
    isChecked,
    isMatchBonus,
    isVipFreeplay,
    promoBonus
  } = await request.json();
  await dbConnect();

  try {
    // Find the user by the token
    const user = await User.findOne({ token: token });

    if (user) {
      if (isChecked) {
        const anyDailyBonus = getDailyCheckedRecords(user.redeem);
        if (anyDailyBonus && anyDailyBonus.length > 0) {
          return NextResponse.json(
            { error: 'Bonus already used today' },
            { status: 400 }
          );
        }
      }

      if (
        isMatchBonus &&
        user.redeem.find((elem: any) => elem.isMatchBonus)?.isMatchBonus
      ) {
        return NextResponse.json(
          { error: 'Match Bonus can only be claimed once per account.' },
          { status: 400 }
        );
      }

      if (isVipFreeplay) {
        if (user.role !== 'vip_user') {
          return NextResponse.json(
            { error: 'VIP Daily Freeplay is available for VIP users only.' },
            { status: 400 }
          );
        }

        const anyVIPBonus = getVipFreePlayRecords(user.redeem);
        if (anyVIPBonus && anyVIPBonus.length > 0) {
          return NextResponse.json(
            { error: 'You have already used your VIP Daily Freeplay today.' },
            { status: 400 }
          );
        }
      }

      if (promoBonus && user.promoBonus) {
        return NextResponse.json(
          { error: 'Promo bonus is already used' },
          { status: 400 }
        );
      }

      const redeemObj: any = {
        amount: amount,
        btc: btc,
        paymentoption: paymentoption,
        paymenttype: paymenttype,
        id: id,
        dailyChecked: isChecked !== undefined ? isChecked : false,
        isMatchBonus: isMatchBonus !== undefined ? isMatchBonus : false,
        isVipFreeplay: isVipFreeplay !== undefined ? isVipFreeplay : false
      };

      if (redeemObj.dailyChecked) {
        redeemObj.isBonusInitializeTime = getCurrentHSTUTCDate();
      }

      if (redeemObj.isVipFreeplay) {
        redeemObj.vipFreeplayTime = getCurrentHSTUTCDate();
      }

      if (promoBonus !== user.promoBonus) {
        redeemObj.isPromoBonus = promoBonus;
      }
      if (promoBonus) {
        user.promoBonus = promoBonus;
      }

      // Add new redeem information to the existing redeems array
      user.redeem.push(redeemObj);
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
