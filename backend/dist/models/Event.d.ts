import mongoose, { Document } from 'mongoose';
export interface IEvent extends Document {
    title: string;
    description: string;
    category: string;
    venue: string;
    startDate: Date;
    endDate: Date;
    status: 'DRAFT' | 'PUBLISHED' | 'CANCELLED' | 'COMPLETED';
    organizerId: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Event: mongoose.Model<IEvent, {}, {}, {}, mongoose.Document<unknown, {}, IEvent, {}, mongoose.DefaultSchemaOptions> & IEvent & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IEvent>;
