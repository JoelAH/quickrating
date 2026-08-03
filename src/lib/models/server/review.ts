import "server-only";
import mongoose from "mongoose";

const Schema = mongoose.Schema;


export const ReviewSchema = new Schema({
  page: {type: Schema.Types.ObjectId, required: true, ref: "User"},
  reviewer: {
    name: {type: String, required: true, trim: true},
    email: {type: String, required: true, trim: true},
    code: {type: String, required: true, trim: true},
  },
  rating: {type: Number},
  comment: {type: String, required: true, trim: true, maxLength: 1000},
  published: {type: Boolean},
  publishedAt: {type: Date},
  completedAt: {type: Date},
  createdAt: {type: Date, default: new Date()},
  updatedAt: {type: Date, default: new Date()},
});

ReviewSchema.pre("save", function(next) {
  this.updatedAt = new Date();
  next();
});

export type Review = {
    _id?: any;
    page: any;
    reviewer: {
        name: string,
        email: string,
        code?: string
    },
    comment: string;
    rating?: number;
    published?: boolean;
    publishedAt?: Date;
    completedAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

export const formatReview = (savedObject: any) => {
  //const formattedReview =  savedObject.toObject() as Review;
  const formattedReview = Object.assign({}, {...savedObject});
  formattedReview.reviewer = {
    name: formattedReview.reviewer.name,
    email: "***",
    code: "***",
  };
  formattedReview._id = savedObject._id.toString();
  formattedReview.page = savedObject.page.toString();

  return formattedReview;
};

export default mongoose.models.Review || mongoose.model("Review", ReviewSchema)
