import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IClub extends Document {
  name: string;
  slug: string;
  description: string;
  mission: string;
  department?: string;
  theme: string;
  icon: string;
  headId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const clubSchema = new Schema<IClub>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    mission: { type: String },
    department: { type: String },
    theme: { type: String, default: 'theme-microsoft' },
    icon: { type: String, default: 'Circle' },
    headId: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

const Club: Model<IClub> = mongoose.models.Club || mongoose.model<IClub>('Club', clubSchema);
export default Club;
