import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import twilio from 'twilio';

const ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID as string;
const AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN as string;
const SERVICE_ID = process.env.TWILIO_SERVICE_ID as string;

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
    console.log('Sending sms to', phoneno, ACCOUNT_SID, AUTH_TOKEN, SERVICE_ID);
    
    const client = twilio(ACCOUNT_SID, AUTH_TOKEN);

    // Send the SMS
    await client.verify.v2.services(SERVICE_ID).verifications.create({
      channel: 'sms',
      to: phoneno
    });

    // Send success response
    return NextResponse.json(
      { message: 'Verification sms sent successfully!' },
      { status: 200 }
    );
  } catch (error) {
    console.log('Error', error);
    return NextResponse.json({ error: 'Failed to send sms' }, { status: 500 });
  }
};
