import User from '@/models/User';
import dbConnect from '@/lib/dbConnect';
import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';

const ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID as string;
const AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN as string;
const SERVICE_ID = process.env.TWILIO_SERVICE_ID as string;

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

    const client = twilio(ACCOUNT_SID, AUTH_TOKEN);

    const verificationCheck = await client.verify.v2
    .services(SERVICE_ID)
    .verificationChecks.create({
      code: phonecode,
      to: phoneno
    });
    if (verificationCheck.status != 'approved' && verificationCheck.valid === false) {
      return NextResponse.json(
        { message: 'Invalid verification code' },
        { status: 404 }
      );
    }
    user.isphoneverify = 'yes';
    await user.save();

    return NextResponse.json(
      { message: 'Phone number verified successfully' },
      { status: 200 }
    );
  } catch (err: any) {
    if (err.status === 404) {
      return NextResponse.json(
        { error: 'Invalid verification code.' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'An error occurred while verifying the code' },
      { status: 500 }
    );
  }
};
