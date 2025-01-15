import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export const POST = async (request: NextRequest) => {
  const { verifytoken, password } = await request.json();
  await dbConnect();

  try {
    const user = await User.findOne({ verifytoken });

    if (!user) {
      return NextResponse.json(
        { error: 'User does not exist' },
        { status: 404 }
      );
    }

    // if (user.verifystatus !== 'yes') {
    //   return NextResponse.json({ error: 'User not verified' }, { status: 403 });
    // }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.verifytoken = null;
    await user.save();

    // Send success response
    return NextResponse.json(
      { message: 'Password reset successfully.' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'An error occurred while reset password' },
      { status: 500 }
    );
  }
};
