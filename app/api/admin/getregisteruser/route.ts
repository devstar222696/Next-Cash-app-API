import User from '@/models/User';
import dbConnect from '@/lib/dbConnect';
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export const GET = async (request: NextRequest) => {
  await dbConnect();

  try {
    revalidatePath('/')
    const users = await User.find({
      // register: { $elemMatch: { nickname: { $ne: 'none' } } },
      action: 'yes'
    });

    const usersInfo = users.map((user) => user.toObject());

    return NextResponse.json(
      { ok: 'Fetch successful', data: usersInfo },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: 'An error occurred while fetching users' },
      { status: 500 }
    );
  }
};
