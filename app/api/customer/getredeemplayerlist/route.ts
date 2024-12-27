import User from '@/models/User';
import dbConnect from '@/lib/dbConnect';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (request: NextRequest) => {
  await dbConnect();

  const frtoken = request.headers.get('Authorization')?.split(' ')[1]; // Assuming the header is in the format "Bearer <token>"

  if (!frtoken) {
    return NextResponse.json(
      { error: 'Authorization token is required' },
      { status: 401 }
    );
  }

  try {
    // If token is valid, fetch the users
    const users = await User.aggregate(
      [
        {
          $match: {
            "withdrawal.paymentstatus": "complete"
          }
        },
        {
          $unwind: "$withdrawal"
        },
        {
          $match: {
            "withdrawal.paymentstatus": "complete"
          }
        },
        {
          $sort: {
            "withdrawal.comdate": -1
          }
        },
        {
          $limit: 5
        },
        {
          $addFields: {
            "withdrawal.user": {
              tag: "$tag" // Replace with other fields you want from the user
            }
          }
        },
        {
          $replaceRoot: {
            newRoot: "$withdrawal"
          }
        }
      ]
    );

    return NextResponse.json(
      { ok: 'Fetch successful', data: users },
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
