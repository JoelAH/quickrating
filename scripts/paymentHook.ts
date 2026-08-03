// @ts-nocheck
const dbObj: { conn: any } = { conn: null };
const DB_URI = process.env["DB_URI"];
const LS_API_KEY = process.env["LS_API_KEY"];
const LS_WEBHOOK_SIG = process.env["LS_WEBHOOK_SIG"];
const LS_REDIRECT_URL = process.env["LS_REDIRECT_URL"];
const DASHBOARD_URL = process.env["DASHBOARD_URL"];
const LS_STORE_ID = process.env["LS_STORE_ID"];
const LS_VARIANT_STANDARD_ID = process.env["LS_VARIANT_STANDARD_ID"];
const LEMON_SQUEEZY_API_URL = "https://api.lemonsqueezy.com/v1";
const LEMON_SQUEEZY_HEADERS = {
  "Accept": "application/vnd.api+json",
  "Content-Type": "application/vnd.api+json",
  "Authorization": `Bearer ${LS_API_KEY}`,
};

const paymentHook = onRequest(async (req, res) => {
  if (!LS_WEBHOOK_SIG) {
    throw new HttpsError(
      "failed-precondition",
      "No Lemon Squeezy keys"
    );
  }
  if (DB_URI) {
    await connectDB(dbObj, DB_URI);
  } else {
    throw new HttpsError(
      "failed-precondition",
      "No DB URI"
    );
  }
  const hmac = crypto.createHmac("sha256", LS_WEBHOOK_SIG);
  const digest = Buffer.from(hmac.update(req.rawBody).digest("hex"), "utf8");
  const signature = Buffer.from(req.get("X-Signature") || "", "utf8");

  if (!crypto.timingSafeEqual(digest, signature)) {
    throw new Error("Invalid signature.");
  }

  const uid = req.body.meta.custom_data.authId as string;
  const user = await UserModel.findOne({ uid });
  if (!user) {
    throw new HttpsError(
      "not-found",
      "User was not found"
    );
  }

  console.log("id", req.body.data.id);
  console.log("authid", req.body.meta.custom_data.authId);
  console.log("tier", req.body.meta.custom_data.tier);
  console.log("status", req.body.data.attributes.status);
  console.log("cancelled", req.body.data.attributes.cancelled);
  console.log("renewsat", req.body.data.attributes.renews_at);
  console.log("ends_at", req.body.data.attributes.ends_at);

  const existingPayment = await PaymentModel.findOne({ uid, subscriptionId: req.body.data.id as string });
  if (existingPayment) {
    existingPayment.tier = req.body.meta.custom_data.tier as VARIANT_TYPE;
    existingPayment.status = req.body.data.attributes.status as string;
    existingPayment.cancelled = req.body.data.attributes.cancelled;
    if (req.body.data.attributes.renews_at) {
      existingPayment.renewsAt = new Date(req.body.data.attributes.renews_at as string);
    }
    if (req.body.data.attributes.ends_at) {
      existingPayment.endsAt = new Date(req.body.data.attributes.ends_at as string);
    }

    await existingPayment.save();
  } else {
    const newPayment = new PaymentModel({
      user: user._id,
      uid,
      tier: req.body.meta.custom_data.tier as VARIANT_TYPE,
      subscriptionId: req.body.data.id,
      status: req.body.data.attributes.status as string,
      cancelled: req.body.data.attributes.cancelled,
    });
    if (req.body.data.attributes.renews_at) {
      newPayment.renewsAt = new Date(req.body.data.attributes.renews_at as string);
    }
    if (req.body.data.attributes.ends_at) {
      newPayment.endsAt = new Date(req.body.data.attributes.ends_at as string);
    }
    await newPayment.save();
  }
  // delete temp
  await PaymentModel.deleteMany({ uid, subscriptionId: "temp", isTemp: true });

  res.send("success");
});