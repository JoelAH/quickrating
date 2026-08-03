import "server-only";
import mongoose from "mongoose";

const Schema = mongoose.Schema;

export enum VARIANT_TYPE {
    STANDARD = "Standard"
}

export const PaymentSchema = new Schema({
  user: {type: Schema.Types.ObjectId, required: true, ref: "User", index: true},
  uid: {type: String, required: true, index: true},
  tier: {type: String, required: true, trim: true},
  subscriptionId: {type: String, required: true, index: true},
  status: {type: String, required: true, trim: true, maxLength: 50},
  cancelled: {type: Boolean},
  renewsAt: {type: Date},
  endsAt: {type: Date},
  createdAt: {type: Date, default: new Date()},
  updatedAt: {type: Date, default: new Date()},
  isTemp: {type: Boolean},
  tempAt: {type: Date},
  tempCode: {type: String},
});

PaymentSchema.pre("save", function(next) {
  this.updatedAt = new Date();
  next();
});

export type Payment = {
    _id?: any;
    uid: string,
    tier: VARIANT_TYPE,
    subscriptionId: string,
    status: string,
    cancelled: boolean,
    renewsAt?: Date,
    endsAt?: Date,
    createdAt?: Date,
    updatedAt?: Date,
    isTemp?: boolean,
    tempAt?: Date,
    tempCode?: string
}

export const formatPayment = (savedObject: Payment) => {
  delete savedObject.createdAt;
  delete savedObject.updatedAt;
  savedObject.subscriptionId = "***";
  savedObject.uid = "***";
  savedObject._id = savedObject._id.toString();

  return savedObject;
};

export const isSubcriptionValid = (payment: Payment | undefined, isTestMode?: string | undefined) => {
  if (isTestMode === "true") return true;
  if (!payment) return false;
  if (payment.isTemp) {
    if (!payment.tempAt) return false;
    const diff = new Date().getTime() - new Date(payment.tempAt).getTime();
    if ((diff/60000) >= 1) {
      return false;
    }
  }

  if (
    (payment.status === "active" && !payment.cancelled) ||
        (payment.endsAt && payment.cancelled && new Date() < new Date(payment.endsAt))
  ) {
    return true;
  }

  return false;
};

export const addMonths = (months: number, date = new Date(), utc = false): Date => {
  const nextMonth = new Date(
    utc ?
      Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth() + months,
        1,
        date.getUTCHours(),
        date.getUTCMinutes(),
        date.getUTCSeconds(),
        date.getUTCMilliseconds()
      ) :
      new Date(
        date.getFullYear(),
        date.getMonth() + months,
        1,
        date.getHours(),
        date.getMinutes(),
        date.getSeconds(),
        date.getMilliseconds()
      )
  );
  const daysInNextMonth = daysInMonth(nextMonth, utc);
  return new Date(
    utc ?
      nextMonth.setUTCDate(
        daysInNextMonth < date.getUTCDate() ? daysInNextMonth : date.getUTCDate()
      ) :
      nextMonth.setDate(
        daysInNextMonth < date.getDate() ? daysInNextMonth : date.getDate()
      )
  );
};

const daysInMonth = (date: Date, utc?: boolean): number => {
  const utcOrYear = utc ? date.getUTCFullYear() : date.getFullYear();
  const dateOrMonth = utc ? date.getUTCMonth() : date.getMonth();
  return new Date(utcOrYear as number, dateOrMonth + 1, 0).getDate();
};

export default mongoose.models.Payment || mongoose.model("Payment", PaymentSchema)
