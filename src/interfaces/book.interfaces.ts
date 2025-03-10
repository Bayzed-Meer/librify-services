import mongoose, { Document } from 'mongoose';
export interface IBook extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  author: string;
  isbn: string;
  genre: string;
  publicationYear: number;
  rfidTag: string;
  isPremium: boolean;
  publisher: string;
  language: string;
  edition: string;
  fileLink: string;
  quantity: number;
  availability: boolean;
  createdAt: Date;
  updatedAt: Date;
}
