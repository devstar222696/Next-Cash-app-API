import { NextRequest, NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import mongoose from 'mongoose';

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
const BASE_URL = process.env.AUTH_URL as string;

export const POST = async (request: NextRequest) => {
  const { email } = await request.json();
  await dbConnect();

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: 'User does not exist' },
        { status: 404 }
      );
    }

    // if (user.verifystatus !== 'yes') {
    //   return NextResponse.json({ error: 'User not verified' }, { status: 403 });
    // }

    const token = new mongoose.Types.ObjectId();
    user.verifytoken = token.toString();
    await user.save();

    const resetPasswordLink = `${BASE_URL}/resetpassword/${token}`;
    // Define the email message
    const msg = {
      to: email,
      from: process.env.EMAIL_USER as string,
      subject: 'Reset Your Password',
      text: 'Your reset password request. Click below link to rest your password',
      html: `<p>Your reset password request. Click below link to rest your password:</p>
           <a href="${resetPasswordLink}" target="_blank">${resetPasswordLink}</a>`
    };

    // Send the email
    await sgMail.send(msg);
    // Send success response
    return NextResponse.json(
      { message: 'Send reset password email successfully!' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'An error occurred while forgot password' },
      { status: 500 }
    );
  }
};
