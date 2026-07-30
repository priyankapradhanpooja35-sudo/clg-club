import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IAnnouncement extends Document {
  title: string;
  content: string;
  priority: 'General' | 'Urgent';
  clubId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const announcementSchema = new Schema<IAnnouncement>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    priority: { type: String, enum: ['General', 'Urgent'], default: 'General' },
    clubId: { type: Schema.Types.ObjectId, ref: 'Club' }, // Optional: global if null
  },
  { timestamps: true }
);

const Announcement: Model<IAnnouncement> = mongoose.models.Announcement || mongoose.model<IAnnouncement>('Announcement', announcementSchema);
export default Announcement;
