import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  description: string;
  clubId: mongoose.Types.ObjectId;
  date: Date;
  venue: string;
  banner?: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    clubId: { type: Schema.Types.ObjectId, ref: 'Club', required: true },
    date: { type: Date, required: true },
    venue: { type: String, required: true },
    banner: { type: String },
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Event: Model<IEvent> = mongoose.models.Event || mongoose.model<IEvent>('Event', eventSchema);
export default Event;
