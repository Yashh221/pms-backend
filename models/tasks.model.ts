import mongoose, { Document, Schema } from "mongoose";

interface Submission {
  description: string;
  proof: string;
  submittedAt: Date;
  reviewdBy: mongoose.Schema.Types.ObjectId[]; //doubt h yaha ek se review karaye ya github ki tarah bahut saare reviewers se
  approvalStatus: "pending" | "approved";
}
interface Tasks extends Document {
  name: string;
  description: string;
  deadline: Date;
  labels: string[];
  assignee?: mongoose.Schema.Types.ObjectId;
  status: "pending" | "approved";
  submission?: Submission;
}

const taskSchema = new Schema<Tasks>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  deadline: {
    type: Date,
    required: true,
  },
  labels: [
    {
      type: String,
      required: true,
    },
  ],
  assignee: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  status: {
    type: String,
    enum: ["pending", "approved"],
  },
  submission: {
    type: {
      description: {
        type: String,
        required: true,
      },
      proof: {
        type: String,
        required: true,
      },
      submittedAt: {
        type: Date,
      },
      reviewdBy: [
        {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      approvalStatus: {
        type: String,
        enum: ["pending", "approved"],
      },
    },
    default: undefined,
  },
});

export const Task = mongoose.model<Tasks>("Task", taskSchema);
