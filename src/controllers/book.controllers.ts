import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../utils/asyncHandler.ts';
import { Book } from '../models/book.models.ts';
import { ApiError } from '../utils/api-error.ts';
import { ApiResponse } from '../utils/api-response.ts';
import { IBook } from '../interfaces/book.interfaces.ts';

// Create a new book
export const createBook = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    const {
      bookId,
      title,
      author,
      isbn,
      genre,
      publicationYear,
      status,
      rfidTag,
      isPremium,
      publisher,
      language,
      edition,
      subjects,
      fileLink,
      quantity,
      availability,
    } = req.body;

    const newBook: IBook = new Book({
      bookId,
      title,
      author,
      isbn,
      genre,
      publicationYear,
      status,
      rfidTag,
      isPremium,
      publisher,
      language,
      edition,
      subjects,
      fileLink,
      quantity,
      availability,
    });

    await newBook.save();

    res.status(201).json(
      new ApiResponse({
        statusCode: 201,
        data: newBook,
        message: 'Book created successfully',
      }),
    );
  },
);

// Get all books
export const getAllBooks = asyncHandler(
  async (_req: Request, res: Response, _next: NextFunction): Promise<void> => {
    const books: IBook[] = await Book.find();

    res.status(200).json(
      new ApiResponse({
        statusCode: 200,
        data: books,
        message: 'Books retrieved successfully',
      }),
    );
  },
);

// Get a single book by ID
export const getBookById = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    const { id } = req.params;
    const book: IBook | null = await Book.findById(id);

    if (!book) {
      throw new ApiError({ statusCode: 404, message: 'Book not found' });
    }

    res.status(200).json(
      new ApiResponse({
        statusCode: 200,
        data: book,
        message: 'Book retrieved successfully',
      }),
    );
  },
);

// Update a book by ID
export const updateBook = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    const { id } = req.params;
    const {
      bookId,
      title,
      author,
      isbn,
      genre,
      publicationYear,
      status,
      rfidTag,
      isPremium,
      publisher,
      language,
      edition,
      subjects,
      fileLink,
      quantity,
      availability,
    } = req.body;

    const updatedBook: IBook | null = await Book.findByIdAndUpdate(
      id,
      {
        bookId,
        title,
        author,
        isbn,
        genre,
        publicationYear,
        status,
        rfidTag,
        isPremium,
        publisher,
        language,
        edition,
        subjects,
        fileLink,
        quantity,
        availability,
      },
      { new: true },
    );

    if (!updatedBook) {
      throw new ApiError({ statusCode: 404, message: 'Book not found' });
    }

    res.status(200).json(
      new ApiResponse({
        statusCode: 200,
        data: updatedBook,
        message: 'Book updated successfully',
      }),
    );
  },
);

// Delete a book by ID
export const deleteBook = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    const { id } = req.params;
    const deletedBook: IBook | null = await Book.findByIdAndDelete(id);

    if (!deletedBook) {
      throw new ApiError({ statusCode: 404, message: 'Book not found' });
    }

    res.status(200).json(
      new ApiResponse({
        statusCode: 200,
        data: deletedBook,
        message: 'Book deleted successfully',
      }),
    );
  },
);
