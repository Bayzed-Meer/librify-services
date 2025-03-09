import mongoose, { Schema, Model } from 'mongoose';
import { IBook } from 'src/interfaces/book.interfaces';

const bookSchema: Schema<IBook> = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    isbn: {
      type: String,
      required: true,
      unique: true,
    },
    genre: {
      type: String,
      required: true,
    },
    publication_year: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    rfid_tag: {
      type: String,
      required: true,
      unique: true,
    },
    is_premium: {
      type: Boolean,
      required: true,
    },
    publisher: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
    edition: {
      type: String,
      required: true,
    },
    subjects: {
      type: [String],
      required: true,
    },
    file_link: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    availability: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Book: Model<IBook> = mongoose.model<IBook>('Book', bookSchema);
