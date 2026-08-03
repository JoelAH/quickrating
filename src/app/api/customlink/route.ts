import dbConnect from "@/lib/db/db";
import { isCustomLinkExists } from "@/lib/db/user";
import { checkAuth } from "@/lib/services/middleware";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    await checkAuth();
    await dbConnect();

    const searchParams = req.nextUrl.searchParams;
    const username = searchParams.get('username');
    if (!username) {
        return NextResponse.json({ message: 'bad request', success: false }, { status: 400 });
    }
    return NextResponse.json((await isCustomLinkExists(username)), { status: 200 });
}