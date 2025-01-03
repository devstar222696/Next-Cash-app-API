import User from '@/models/User';
import dbConnect from '@/lib/dbConnect';
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export const GET = async (request: NextRequest) => {
  await dbConnect();

  try {
    revalidatePath('/')
    const counts = await User.aggregate(
        [
            {
              $project: {
                registerCount: {
                  $size: {
                    $filter: {
                      input: "$register",
                      as: "item",
                      cond: {
                        $in: [
                          "$$item.status",
                          ["Processing", "preparing"]
                        ]
                      }
                    }
                  }
                },
                          redeemCount: {
                      $size: {
                        $filter: {
                          input: "$redeem",
                          as: "item",
                          cond: {
                            $in: ["$$item.paymentstatus", ["Processing", "preparing"]],
                          },
                        },
                      },
                    },
                    withdrawalCount: {
                      $size: {
                        $filter: {
                          input: "$withdrawal",
                          as: "item",
                          cond: {
                            $in: ["$$item.paymentstatus", ["Processing", "preparing"]],
                          },
                        },
                      },
                    },
              },
            },
            {
              $group: {
                _id: null,
                register: {
                  $sum: "$registerCount"
                },
                redeem: {
                  $sum: "$redeemCount"
                },
                withdrawal: {
                  $sum: "$withdrawalCount"
                }
              }
            },
                 {
                  $project: {
                    _id: 0,
                    register: 1,
                    redeem: 1,
                    withdrawal: 1,
                  }
                 }
          ]
);

    return NextResponse.json(
      { ok: 'Fetch successful', data: counts[0] || { register: 0, redeem: 0, withdrawal: 0 } },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: 'An error occurred while fetching users' },
      { status: 500 }
    );
  }
};
