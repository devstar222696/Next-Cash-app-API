import SeasonGame from '@/models/SeasonGame';
import dbConnect from '@/lib/dbConnect';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (request: NextRequest) => {
  const { games } = await request.json();
  console.log('games: ', games);
  await dbConnect();

  try {
    const seasonGames = games.map((game: any) => ({
      updateOne: {
        filter: { _id: game.id },
        update: { $set: { isfavourite: game.isfavourite } },
      },
    }));
    
    await SeasonGame.bulkWrite(seasonGames);

    return NextResponse.json(
      { ok: 'Season game favorite successfully' },
      { status: 200 }
    );
  } catch (err: any) {
    console.log('err: ', err);
    return NextResponse.json(
      { error: 'An error occurred while favorite season game' },
      { status: 500 }
    );
  }
};
