import "server-only";
import CONSTANTS from "@/lib/constants";
import mongoose from "mongoose";

const Schema = mongoose.Schema;

export const DefaultUserSettings = {
  reviewLimit: CONSTANTS.freeReviewLimit,
  allowPublish: false,
  allowNotifications: false,
  poweredBy: true,
};


export const UserSchema = new Schema({
  uid: {type: String, required: true, unique: true, index: true},
  email: {type: String, required: true, unique: true, trim: true, index: true},
  businessName: {type: String, required: true, trim: true, maxLength: 100},
  greeting: {type: String, trim: true, maxLength: 100},
  customLink: {type: String, required: true, trim: true, maxLength: 100, index: true},
  themeColor: {type: String, trim: true, maxLength: 50},
  imageUrl: {type: String, trim: true},
  contact: {
    address: {type: String},
    phone: {type: String},
    whatsapp: {type: String},
    facebook: {type: String},
    twitter: {type: String},
    instagram: {type: String},
    tiktok: {type: String},
    linkedin: {type: String},
    mail: {type: String},
  },
  createdAt: {type: Date, default: new Date()},
  updatedAt: {type: Date, default: new Date()},
  deletedAt: {type: Date},
  lastSeenAt: {type: Date},
  hits: {type: Number}
});

UserSchema.pre("save", function(next) {
  this.updatedAt = new Date();
  next();
});

export type User = {
    _id?: any;
    uid: string,
    email: string,
    businessName: string,
    greeting?: string,
    customLink: string,
    themeColor?: string;
    imageUrl?: string,
    contact?: {
        address?: string
        phone?: string,
        whatsapp?: string,
        facebook?: string,
        twitter?: string,
        instagram?: string,
        tiktok?: string,
        linkedin?: string,
        mail?: string
    },
    createdAt?: Date,
    updatedAt?: Date,
    deletedAt?: Date,
    lastSeenAt?: Date,
    hits?: number
}

export const formatUser = (savedObject: any): User => {
  const formattedUser =  savedObject.toObject() as User;
  delete formattedUser.createdAt;
  delete formattedUser.updatedAt;
  delete formattedUser.lastSeenAt;
  delete formattedUser.deletedAt;
  delete formattedUser.createdAt;
  formattedUser._id = formattedUser._id.toString();

  return formattedUser
};

export default mongoose.models.User || mongoose.model("User", UserSchema)
