import "server-only";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/db";
import UserModel from "@/lib/models/server/user";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Authorization check
    if (body.key !== 'next') {
      return NextResponse.json(
        { error: "Not authorized" },
        { status: 403 }
      );
    }

    // Connect to database
    await dbConnect();

    // Fetch users with limited fields
    const profiles = await UserModel.find({})
      .select({ customLink: 1, updatedAt: 1 })
      .lean();

    // Limit to 100 results
    const result = profiles.length > 100 ? profiles.slice(0, 100) : profiles;

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error in get-all-users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
