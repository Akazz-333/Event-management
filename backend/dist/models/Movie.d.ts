import mongoose, { Document } from 'mongoose';
export interface IMovie extends Document {
    title: string;
    plot?: string;
    fullplot?: string;
    genres: string[];
    runtime?: number;
    poster?: string;
    released?: Date;
    directors?: string[];
    cast?: string[];
    imdb?: {
        rating: number;
        votes: number;
    };
    rated?: string;
    year?: number;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare const Movie: mongoose.Model<IMovie, {}, {}, {}, mongoose.Document<unknown, {}, IMovie, {}, mongoose.DefaultSchemaOptions> & IMovie & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IMovie>;
