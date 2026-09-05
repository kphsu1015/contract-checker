import mongoose, { Schema, InferSchemaType, Model } from "mongoose";

const RiskItemSchema = new Schema(
  {
    clause: { type: String, default: "" },
    issue: { type: String, required: true },
    severity: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    suggestion: { type: String, default: "" },
  },
  { _id: false }
);

const ReviewSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    fileName: { type: String, required: true },
    fileType: { type: String, default: "" },
    fileSize: { type: Number, default: 0 },
    blobUrl: { type: String, required: true },
    model: { type: String, default: "" },

    summary: { type: String, default: "" },
    contractType: { type: String, default: "" },
    overallRisk: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    riskItems: { type: [RiskItemSchema], default: [] },
    missingClauses: { type: [String], default: [] },
    recommendations: { type: [String], default: [] },
  },
  { timestamps: true }
);

export type ReviewDoc = InferSchemaType<typeof ReviewSchema>;

export const Review: Model<ReviewDoc> =
  (mongoose.models.Review as Model<ReviewDoc>) ||
  mongoose.model<ReviewDoc>("Review", ReviewSchema);
