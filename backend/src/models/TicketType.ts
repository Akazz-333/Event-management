import mongoose, { Schema, Document } from 'mongoose';

export interface ITicketType extends Document {
  eventId: mongoose.Types.ObjectId;
  name: string;
  price: number;
  capacity: number;
  soldCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const TicketTypeSchema: Schema = new Schema(
  {
    eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    capacity: { type: Number, required: true, min: 1 },
    soldCount: { type: Number, default: 0, min: 0 },
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

export const TicketType = mongoose.model<ITicketType>('TicketType', TicketTypeSchema);
