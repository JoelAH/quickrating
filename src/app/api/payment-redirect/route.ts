import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";
import dbConnect from "@/lib/db/db";
import PaymentModel from "@/lib/models/server/payment";

export const dynamic = 'force-dynamic';

const DASHBOARD_URL = process.env.DASHBOARD_URL || "https://quickrating.page/main/dashboard";

export async function GET(req: NextRequest) {
  try {
    // Connect to database
    await dbConnect();

    // Get query parameters
    const searchParams = req.nextUrl.searchParams;
    const reqCode = searchParams.get("code");
    const reqId = searchParams.get("id");
    const reqTime = searchParams.get("time");

    console.log(reqCode, reqId, reqTime);

    // If missing parameters, redirect to dashboard
    if (!reqCode || !reqId || !reqTime) {
      return NextResponse.redirect(DASHBOARD_URL);
    }

    // Check if request is within 2 minutes
    const timeDiff = (new Date().getTime() - Number(reqTime)) / 60000;
    
    if (timeDiff <= 2) {
      // Update temporary payment record
      await PaymentModel.updateOne(
        { 
          user: new Types.ObjectId(reqId), 
          tempCode: reqCode, 
          isTemp: true, 
          subscriptionId: "temp" 
        },
        { 
          tempAt: new Date(), 
          tempCode: "done" 
        }
      );
    }

    // Redirect to dashboard
    return NextResponse.redirect(DASHBOARD_URL);
  } catch (error) {
    console.error("Error in payment-redirect:", error);
    return NextResponse.redirect(DASHBOARD_URL);
  }
}
