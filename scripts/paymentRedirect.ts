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

const paymentRedirect = onRequest(async (req, res) => {
  if (DB_URI) {
    await connectDB(dbObj, DB_URI);
  } else {
    throw new HttpsError(
      "failed-precondition",
      "No DB URI"
    );
  }
  const reqCode = req.query["code"] as string;
  const reqId = req.query["id"] as string;
  const reqTime = req.query["time"] as string;
  console.log(reqCode, reqId, reqTime)
  if (!reqCode || !reqId || !reqTime) {
    res.redirect(DASHBOARD_URL || "https://quickrating.page/main/dashboard");
  }
  if ((new Date().getTime() - Number(reqTime)) / 60000 <= 2) {
    await PaymentModel.updateOne({ user: new Types.ObjectId(reqId), tempCode: reqCode, isTemp: true, subscriptionId: "temp" }, { tempAt: new Date(), tempCode: "done" });
  }
  res.redirect(DASHBOARD_URL || "https://quickrating.page/main/dashboard");
});