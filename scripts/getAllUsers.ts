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

const getAllUsers = onRequest(async (req, res) => {
  console.log('body', req.body)
  if (JSON.parse(req.body).key !== 'next') {
    throw new HttpsError(
      "failed-precondition",
      "Not authorized"
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
  const profiles = await UserModel.find({}).select({ customLink: 1, updatedAt: 1 });
  let val = profiles;
  if (profiles.length > 100) {
    val = profiles.slice(0, 100);
  }
  res.send(val);
});