import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (request: NextRequest) => {
  await dbConnect();

  try {
    await User.updateMany(
      { role: { $in: ['vip_user', 'user'] } },
      { $set: { promoBonus: false } }
    );

    return NextResponse.json(
      {
        ok: 'PromoBonus reset successfully.'
      },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};
