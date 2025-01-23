import User from '@/models/User';
import dbConnect from '@/lib/dbConnect';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (request: NextRequest) => {
  await dbConnect();

  const id = request.headers.get('Authorization')?.split(' ')[1];

  if (!id) {
    return NextResponse.json(
      { error: 'Authorization token is required' },
      { status: 401 }
    );
  }

  try {
    const users = await User.find({ _id: id });

    const usersInfo = users.map((user) => {
      const totalDepositsCount =
        user.redeem?.filter(
          (redeem: any) => redeem.paymentstatus === 'complete'
        ).length || 0; // Count deposits with status "complete"
      const totalWithdrawalsCount =
        user.withdrawal?.filter(
          (withdrawal: any) => withdrawal.paymentstatus === 'complete'
        ).length || 0; // Count withdrawals with status "complete"

      return {
        ...user.toObject(),
        totalDepositsCount,
        totalWithdrawalsCount
      };
    });

    return NextResponse.json(
      { ok: 'Fetch successful', data: usersInfo },
      { status: 200 }
    );
  } catch (err: any) {
    if (err.name === 'JsonWebTokenError') {
      return NextResponse.json({ error: 'Invalid token' }, { status: 403 });
    } else if (err.name === 'TokenExpiredError') {
      return NextResponse.json({ error: 'Token expired' }, { status: 402 });
    }

    return NextResponse.json(
      { error: 'An error occurred while fetching users' },
      { status: 500 }
    );
  }
};
