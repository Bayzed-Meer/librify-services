import mongoose, { Document } from 'mongoose';

export interface IBook extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  author: string;
  isbn: string;
  genre: string;
  publication_year: number;
  status: string;
  rfid_tag: string;
  is_premium: boolean;
  publisher: string;
  language: string;
  edition: string;
  subjects: string[];
  file_link: string;
  quantity: number;
  availability: boolean;
  createdAt: Date;
  updatedAt: Date;
}
