import User from '@/models/User';
import dbConnect from '@/lib/dbConnect';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { ErrorCodes } from '@/types';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export const POST = async (request: NextRequest) => {
  const { email, password } = await request.json();
  await dbConnect();

  const rawIp = request.headers.get('x-forwarded-for') || request.ip || '0.0.0.0';
  const ip = rawIp.split(',')[0].replace(/^.*:ffff:/, '');

  try {
    let user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return NextResponse.json(
        { error: 'User does not exist' },
        { status: 404 }
      );
    }

    if (user.isphoneverify !== 'yes') {
      return NextResponse.json({ error: 'Phone number not verified. Please verify your phone number first.', errCode: ErrorCodes.phoneNotVerified }, { status: 403 });
    }

    // if (user.verifystatus !== 'yes') {
    //   return NextResponse.json({ error: 'User not verified', errCode: ErrorCodes.emailNotVerified }, { status: 403 });
    // }


    if (user.action !== 'yes') {
      return NextResponse.json(
        { error: 'User not activited' },
        { status: 402 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    user.token = token;
    user.lastLoginIp = ip
   
    await user.save();

    const responsePayload = {
      userId: user._id,
      name: user.firstname,
      email: user.email,
      role: user.role,
      token: user.token
    };

    return NextResponse.json(
      { ok: 'Sign-in successful', user: responsePayload },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: 'An error occurred while signing in' },
      { status: 500 }
    );
  }
};
