import User from '@/models/User';
import dbConnect from '@/lib/dbConnect';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (request: NextRequest) => {
  // Attempt to parse the JSON body
  let requestData;
  try {
    requestData = await request.json();
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to parse JSON' },
      { status: 400 }
    );
  }

  const { id, status, loginid, passwordcode, date } = requestData;

  // Ensure required fields are present
  if (!id || !status || !date || !loginid || !passwordcode) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }

  await dbConnect();

  try {
    // Find the user by ID
    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const registerIndex = user.register.findIndex((dep: any) => {
      const depDate = new Date(dep.date).getTime();
      const requestDate = new Date(date).getTime();
      return depDate === requestDate;
    });

    if (registerIndex === -1) {
      return NextResponse.json(
        { error: 'No register found with the given date' },
        { status: 404 }
      );
    }

    if (status === 'decline') {
      // Remove the registration entry
      user.register.splice(registerIndex, 1);
    } else {
      user.register[registerIndex].status = status;
      user.register[registerIndex].loginid = loginid;
      user.register[registerIndex].passwordcode = passwordcode;
      user.register[registerIndex]._doc.comdate = new Date();
    }

    // Save the user document
    const updatedUser = await user.save();

    return NextResponse.json(
      {
        ok: status === 'decline' ? 'register declined and removed successfully' : 'register updated successfully',
        user: updatedUser
      },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Internal server error', details: err.message },
      { status: 500 }
    );
  }
};
