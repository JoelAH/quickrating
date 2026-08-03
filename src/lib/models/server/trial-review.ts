import "server-only";
import mongoose from "mongoose";

const Schema = mongoose.Schema;

export const TrialReviewSchema = new Schema({
  page: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "TrialPage",
    index: true
  },
  reviewer: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    code: {
      type: String,
      required: true,
      trim: true
    }
  },
  rating: {
    type: Number
  },
  comment: {
    type: String,
    required: true,
    trim: true,
    maxLength: 1000
  },
  published: {
    type: Boolean,
    default: true
  },
  publishedAt: {
    type: Date
  },
  completedAt: {
    type: Date,
    index: true
  },
  createdAt: {
    type: Date,
    default: new Date()
  },
  updatedAt: {
    type: Date,
    default: new Date()
  }
});

TrialReviewSchema.pre("save", function(next) {
  this.updatedAt = new Date();
  next();
});

export type TrialReview = {
  _id?: any;
  page: any;
  reviewer: {
    name: string;
    email: string;
    code?: string;
  };
  rating?: number;
  comment: string;
  published: boolean;
  publishedAt?: Date;
  completedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export const formatTrialReview = (savedObject: any): TrialReview => {
  const formattedReview = Object.assign({}, {...savedObject});
  formattedReview.reviewer = {
    name: formattedReview.reviewer.name,
    email: "***",
    code: "***"
  };
  formattedReview._id = savedObject._id.toString();
  formattedReview.page = savedObject.page.toString();
  
  return formattedReview;
};

export default mongoose.models.TrialReview || mongoose.model("TrialReview", TrialReviewSchema);
