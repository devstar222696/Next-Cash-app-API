import User from '@/models/User';
import dbConnect from '@/lib/dbConnect';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (request: NextRequest) => {
  const { phoneno, phonecode } = await request.json();

  // Connect to the database
  await dbConnect();

  try {
    // Find the user by phone number
    const user = await User.findOne({ phoneno: phoneno });

    // Check if the user exists
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Compare the provided phonecode with the phonecode in the database
    if (user.phonecode === phonecode) {
      user.isphoneverify = 'yes';
      await user.save();

      return NextResponse.json(
        { message: 'Phone number verified successfully' },
        { status: 200 }
      );
    }
    // If codes do not match, return an error
    return NextResponse.json(
      { error: 'Verification code does not match' },
      { status: 400 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: 'An error occurred while verifying the code' },
      { status: 500 }
    );
  }
};
