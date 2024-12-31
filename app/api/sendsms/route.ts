import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import twilio from 'twilio';
import { generateUniqueTag } from '@/lib/user';

const ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID as string;
const AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN as string;
const PHONE_NO = process.env.TWILIO_PHONE_NO as string;

export const POST = async (request: NextRequest) => {
  const { phoneno } = await request.json();
  await dbConnect();

  try {
    const user = await User.findOne({ phoneno });

    if (!user) {
      return NextResponse.json(
        { error: 'User does not exist' },
        { status: 404 }
      );
    }

    const client = twilio(ACCOUNT_SID, AUTH_TOKEN);

    // Send the SMS
    const code = await generateUniqueTag();
    await client.messages.create({
      body: `Your verification code is ${code}. Please enter it to verify your phone number.`,
      from: PHONE_NO, // Your Twilio phone number
      to: phoneno
    });

    user.phonecode = code;
    await user.save();
    // Send success response
    return NextResponse.json(
      { message: 'Verification sms sent successfully!' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send sms' }, { status: 500 });
  }
};
