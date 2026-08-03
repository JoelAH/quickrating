import "server-only";
import mongoose from "mongoose";

const Schema = mongoose.Schema;

export const IPRateLimitSchema = new Schema({
  ipAddress: { type: String, required: true, index: true },
  attempts: { type: Number, default: 1 },
  firstAttemptAt: { type: Date, default: new Date() },
  lastAttemptAt: { type: Date, default: new Date() },
  expiresAt: { type: Date, required: true, index: true },
});

// TTL index to automatically delete documents after expiration (24 hours)
IPRateLimitSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export type IPRateLimit = {
  _id?: any;
  ipAddress: string;
  attempts: number;
  firstAttemptAt: Date;
  lastAttemptAt: Date;
  expiresAt: Date;
};

export default mongoose.models.IPRateLimit || mongoose.model("IPRateLimit", IPRateLimitSchema);
