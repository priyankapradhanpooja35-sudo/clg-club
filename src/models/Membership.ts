import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IMembership extends Document {
  clubId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  status: 'Pending' | 'Approved' | 'Rejected';
  memberRole: 'President' | 'Secretary' | 'Member';
  createdAt: Date;
  updatedAt: Date;
}

const membershipSchema = new Schema<IMembership>(
  {
    clubId: { type: Schema.Types.ObjectId, ref: 'Club', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    memberRole: { type: String, enum: ['President', 'Secretary', 'Member'], default: 'Member' },
  },
  { timestamps: true }
);

membershipSchema.index({ clubId: 1, userId: 1 }, { unique: true });

const Membership: Model<IMembership> = mongoose.models.Membership || mongoose.model<IMembership>('Membership', membershipSchema);
export default Membership;
