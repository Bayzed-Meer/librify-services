import mongoose, { Schema, Model } from 'mongoose';
import { IBook } from 'src/interfaces/book.interfaces';

const bookSchema: Schema<IBook> = new Schema(
  {
    author: {
      type: String,
      required: true,
      trim: true,
    },
    availability: {
      type: Boolean,
      required: true,
    },
    edition: {
      type: String,
      trim: true,
    },
    file: {
      type: String,
      trim: true,
    },
    genre: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      trim: true,
      required: true,
    },
    isbn: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    isPremium: {
      type: Boolean,
      required: true,
    },
    language: {
      type: String,
      required: true,
      trim: true,
    },
    publicationYear: {
      type: Number,
      required: true,
      min: 0,
    },
    publisher: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    rfidTag: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Book: Model<IBook> = mongoose.model<IBook>('Book', bookSchema);
