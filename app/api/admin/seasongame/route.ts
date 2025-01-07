import SeasonGame from '@/models/SeasonGame';
import dbConnect from '@/lib/dbConnect';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (request: NextRequest) => {
  await dbConnect();

  try {
    const seasonGame = await SeasonGame.find();

    return NextResponse.json(
      { ok: 'Fetch season game successful', data: seasonGame },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: 'An error occurred while fetching season game' },
      { status: 500 }
    );
  }
};
