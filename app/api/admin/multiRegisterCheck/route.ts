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

  const { status, data } = requestData;

  // Ensure required fields are present
  if (!status || !Array.isArray(data)) {
    return NextResponse.json(
      { error: 'Missing required fields or data is not an array' },
      { status: 400 }
    );
  }

  // Connect to the database
  await dbConnect();

  try {
    // Initialize a response array for results
    const results = [];

    // Iterate over the data array
    for (const item of data) {
      const { id, date, loginid, passwordcode } = item;

      // Ensure id and date are present
      if (!id || !date) {
        return NextResponse.json(
          { error: 'Missing id or date in data' },
          { status: 400 }
        );
      }

      // Find the user by ID
      const user = await User.findById(id);
      if (!user) {
        results.push({ id, status: 'User not found' });
        continue; // Move on to the next item
      }

      const registerIndex = user.register.findIndex((dep: any) => {
        const depDate = new Date(dep.date).getTime();
        const requestDate = new Date(date).getTime();
        return depDate === requestDate;
      });

      if (registerIndex === -1) {
        results.push({ id, status: 'No register found with the given date' });
        continue; // Move on to the next item
      }

      // Update the status of the found register entry
      user.register[registerIndex].status = status;

      // Add the current date and time to the 'comdate' field
      user.register[registerIndex]._doc.comdate = new Date(); // Captures the current date and time
      user.register[registerIndex].loginid = loginid;
      user.register[registerIndex].passwordcode = passwordcode;
      // Save the user document
      await user.save();

      results.push({ id, status: 'register updated successfully' });
    }

    return NextResponse.json(
      {
        results
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
