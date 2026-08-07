import mongoose, { Document } from 'mongoose';
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
export declare const Registration: mongoose.Model<IRegistration, {}, {}, {}, mongoose.Document<unknown, {}, IRegistration, {}, mongoose.DefaultSchemaOptions> & IRegistration & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IRegistration>;
