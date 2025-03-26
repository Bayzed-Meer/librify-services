import mongoose, { Document } from 'mongoose';

export interface IBook extends Document {
  _id: mongoose.Types.ObjectId;
  author: string;
  availability: boolean;
  edition?: string;
  file?: string;
  genre: string;
  image: string;
  isbn: string;
  isPremium: boolean;
  language: string;
  publicationYear: number;
  publisher: string;
  quantity: number;
  rfidTag: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}
