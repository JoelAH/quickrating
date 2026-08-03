import "server-only";
import mongoose from "mongoose";

const Schema = mongoose.Schema;

export const TrialPageSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    maxLength: 100,
    index: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  businessName: {
    type: String,
    required: true,
    trim: true,
    maxLength: 100
  },
  greeting: {
    type: String,
    trim: true,
    maxLength: 100
  },
  themeColor: {
    type: String,
    trim: true,
    maxLength: 50
  },
  imageUrl: {
    type: String,
    trim: true
  },
  contact: {
    address: {type: String},
    phone: {type: String},
    whatsapp: {type: String},
    facebook: {type: String},
    twitter: {type: String},
    instagram: {type: String},
    tiktok: {type: String},
    linkedin: {type: String},
    mail: {type: String}
  },
  claimToken: {
    type: String,
    unique: true,
    sparse: true,
    index: true
  },
  claimTokenExpiry: {
    type: Date
  },
  claimed: {
    type: Boolean,
    default: false
  },
  claimedBy: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  claimedAt: {
    type: Date
  },
  expired: {
    type: Boolean,
    default: false
  },
  expiresAt: {
    type: Date,
    required: true,
    index: true
  },
  createdAt: {
    type: Date,
    default: new Date()
  },
  updatedAt: {
    type: Date,
    default: new Date()
  },
  hits: {
    type: Number
  }
});

TrialPageSchema.pre("save", function(next) {
  this.updatedAt = new Date();
  next();
});

export type TrialPage = {
  _id?: any;
  username: string;
  email?: string;
  businessName: string;
  greeting?: string;
  themeColor?: string;
  imageUrl?: string;
  contact?: {
    address?: string;
    phone?: string;
    whatsapp?: string;
    facebook?: string;
    twitter?: string;
    instagram?: string;
    tiktok?: string;
    linkedin?: string;
    mail?: string;
  };
  claimToken?: string;
  claimTokenExpiry?: Date;
  claimed: boolean;
  claimedBy?: any;
  claimedAt?: Date;
  expired: boolean;
  expiresAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
  hits?: number;
}

export const formatTrialPage = (savedObject: any): TrialPage => {
  const formattedTrialPage = savedObject.toObject() as TrialPage;
  formattedTrialPage._id = formattedTrialPage._id.toString();
  
  if (formattedTrialPage.claimedBy) {
    formattedTrialPage.claimedBy = formattedTrialPage.claimedBy.toString();
  }
  
  return formattedTrialPage;
};

export default mongoose.models.TrialPage || mongoose.model("TrialPage", TrialPageSchema);
