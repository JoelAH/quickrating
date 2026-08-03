import "server-only";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/lib/db/db";
import UserModel from "@/lib/models/server/user";
import PaymentModel, { VARIANT_TYPE } from "@/lib/models/server/payment";

const LS_WEBHOOK_SIG = process.env.LS_WEBHOOK_SIG;

export async function POST(req: NextRequest) {
  try {
    // Check for webhook signature
    if (!LS_WEBHOOK_SIG) {
      return NextResponse.json(
        { error: "No Lemon Squeezy keys configured" },
        { status: 500 }
      );
    }

    // Connect to database
    await dbConnect();

    // Get raw body for signature verification
    const rawBody = await req.text();
    const body = JSON.parse(rawBody);

    // Verify webhook signature
    const hmac = crypto.createHmac("sha256", LS_WEBHOOK_SIG);
    const digest = Buffer.from(hmac.update(rawBody).digest("hex"), "utf8");
    const signature = Buffer.from(req.headers.get("X-Signature") || "", "utf8");

    if (digest !== signature) {
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      );
    }

    // Extract data from webhook
    const uid = body.meta.custom_data.authId as string;
    const user = await UserModel.findOne({ uid });
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    console.log("id", body.data.id);
    console.log("authid", body.meta.custom_data.authId);
    console.log("tier", body.meta.custom_data.tier);
    console.log("status", body.data.attributes.status);
    console.log("cancelled", body.data.attributes.cancelled);
    console.log("renewsat", body.data.attributes.renews_at);
    console.log("ends_at", body.data.attributes.ends_at);

    // Check if payment record exists
    const existingPayment = await PaymentModel.findOne({ 
      uid, 
      subscriptionId: body.data.id as string 
    });

    if (existingPayment) {
      // Update existing payment
      existingPayment.tier = body.meta.custom_data.tier as VARIANT_TYPE;
      existingPayment.status = body.data.attributes.status as string;
      existingPayment.cancelled = body.data.attributes.cancelled;
      
      if (body.data.attributes.renews_at) {
        existingPayment.renewsAt = new Date(body.data.attributes.renews_at as string);
      }
      
      if (body.data.attributes.ends_at) {
        existingPayment.endsAt = new Date(body.data.attributes.ends_at as string);
      }

      await existingPayment.save();
    } else {
      // Create new payment record
      const newPayment = new PaymentModel({
        user: user._id,
        uid,
        tier: body.meta.custom_data.tier as VARIANT_TYPE,
        subscriptionId: body.data.id,
        status: body.data.attributes.status as string,
        cancelled: body.data.attributes.cancelled,
      });

      if (body.data.attributes.renews_at) {
        newPayment.renewsAt = new Date(body.data.attributes.renews_at as string);
      }
      
      if (body.data.attributes.ends_at) {
        newPayment.endsAt = new Date(body.data.attributes.ends_at as string);
      }

      await newPayment.save();
    }

    // Delete temporary payment records
    await PaymentModel.deleteMany({ uid, subscriptionId: "temp", isTemp: true });

    return NextResponse.json({ message: "success" }, { status: 200 });
  } catch (error) {
    console.error("Error in payment-hook:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
