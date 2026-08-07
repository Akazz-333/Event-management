import mongoose, { Document } from 'mongoose';
export interface ITicketType extends Document {
    eventId: mongoose.Types.ObjectId;
    name: string;
    price: number;
    capacity: number;
    soldCount: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare const TicketType: mongoose.Model<ITicketType, {}, {}, {}, mongoose.Document<unknown, {}, ITicketType, {}, mongoose.DefaultSchemaOptions> & ITicketType & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ITicketType>;
