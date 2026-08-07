import mongoose, { Schema, Document } from 'mongoose';

export interface IRegistration extends Document {
  ticketCode: string;
  userId: mongoose.Types.ObjectId;
  eventId: mongoose.Types.ObjectId;
  ticketTypeId: mongoose.Types.ObjectId;
  status: 'CONFIRMED' | 'CANCELLED' | 'ATTENDED';
  checkedInAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const RegistrationSchema: Schema = new Schema(
  {
    ticketCode: { type: String, required: true, unique: true, uppercase: true, trim: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    ticketTypeId: { type: Schema.Types.ObjectId, ref: 'TicketType', required: true },
    status: { type: String, enum: ['CONFIRMED', 'CANCELLED', 'ATTENDED'], default: 'CONFIRMED' },
    checkedInAt: { type: Date, default: null },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc: any, ret: any) => {
        ret.id = ret._id ? ret._id.toString() : ret.id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const Registration = mongoose.model<IRegistration>('Registration', RegistrationSchema);
