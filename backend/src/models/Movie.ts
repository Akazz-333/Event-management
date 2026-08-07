import mongoose, { Schema, Document } from 'mongoose';

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

const MovieSchema: Schema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    plot: { type: String, trim: true },
    fullplot: { type: String, trim: true },
    genres: [{ type: String, trim: true }],
    runtime: { type: Number },
    poster: { type: String, trim: true },
    released: { type: Date },
    directors: [{ type: String, trim: true }],
    cast: [{ type: String, trim: true }],
    imdb: {
      rating: { type: Number },
      votes: { type: Number },
    },
    rated: { type: String, trim: true },
    year: { type: Number },
  },
  {
    collection: 'movies',
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

export const Movie = mongoose.model<IMovie>('Movie', MovieSchema);
