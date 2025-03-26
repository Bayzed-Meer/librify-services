import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../../utils/api-error.ts';
import { Book } from '../../models/book.models.ts';
import { asyncHandler } from '../../utils/asyncHandler.ts';
import { removeLocalFile } from '../../utils/local-file-remover.ts';

export const validateBook = [
  body('author')
    .trim()
    .notEmpty()
    .withMessage('Author is required')
    .bail()
    .isString()
    .withMessage('Author must be a string'),

  body('availability')
    .notEmpty()
    .withMessage('Availability is required')
    .bail()
    .toBoolean()
    .isBoolean()
    .withMessage('Availability must be a boolean'),

  body('edition')
    .optional()
    .trim()
    .isString()
    .withMessage('Edition must be a string'),

  body('genre')
    .trim()
    .notEmpty()
    .withMessage('Genre is required')
    .bail()
    .isString()
    .withMessage('Genre must be a string'),

  body('isbn')
    .trim()
    .notEmpty()
    .withMessage('ISBN is required')
    .bail()
    .isString()
    .withMessage('ISBN must be a string')
    .bail()
    .isISBN()
    .withMessage('Invalid ISBN format'),

  body('isPremium')
    .notEmpty()
    .withMessage('IsPremium is required')
    .bail()
    .toBoolean()
    .isBoolean()
    .withMessage('IsPremium must be a boolean'),

  body('language')
    .trim()
    .notEmpty()
    .withMessage('Language is required')
    .bail()
    .isString()
    .withMessage('Language must be a string'),

  body('publicationYear')
    .notEmpty()
    .withMessage('Publication Year is required')
    .bail()
    .toInt()
    .isInt({ min: 0 })
    .withMessage('Publication year must be a valid number'),

  body('publisher')
    .trim()
    .notEmpty()
    .withMessage('Publisher is required')
    .bail()
    .isString()
    .withMessage('Publisher must be a string'),

  body('quantity')
    .notEmpty()
    .withMessage('Quantity is required')
    .bail()
    .toInt()
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),

  body('rfidTag')
    .trim()
    .notEmpty()
    .withMessage('RFID Tag is required')
    .bail()
    .isString()
    .withMessage('RFID Tag must be a string'),

  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .bail()
    .isString()
    .withMessage('Title must be a string'),

  asyncHandler(
    async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
      const errors = validationResult(req);

      const files = req.files as
        | { [fieldname: string]: Express.Multer.File[] }
        | undefined;
      const imageLocalPath = files?.['image']?.[0]?.path ?? null;
      const fileLocalPath = files?.['file']?.[0]?.path ?? null;

      if (!errors.isEmpty()) {
        if (imageLocalPath) removeLocalFile(imageLocalPath);
        if (fileLocalPath) removeLocalFile(fileLocalPath);

        throw new ApiError({
          statusCode: 400,
          message: 'Required fields are missing or invalid.',
          errors: errors.array(),
        });
      } else {
        if (!imageLocalPath) {
          throw new ApiError({ statusCode: 400, message: 'Image is required' });
        }

        if (fileLocalPath) {
          const fileExtension = files?.['file']?.[0]?.mimetype.split('/')[1];

          if (fileExtension !== 'pdf') {
            removeLocalFile(imageLocalPath);
            removeLocalFile(fileLocalPath);
            throw new ApiError({
              statusCode: 400,
              message: 'File must be a PDF',
            });
          }
        }

        const existingBookByIsbn = await Book.findOne({ isbn: req.body.isbn });

        if (existingBookByIsbn) {
          removeLocalFile(imageLocalPath);
          if (fileLocalPath) removeLocalFile(fileLocalPath);

          throw new ApiError({
            statusCode: 400,
            message: 'ISBN already exists',
          });
        }

        const existingBookByRfidTag = await Book.findOne({
          rfidTag: req.body.rfidTag,
        });

        if (existingBookByRfidTag) {
          removeLocalFile(imageLocalPath);
          if (fileLocalPath) removeLocalFile(fileLocalPath);

          throw new ApiError({
            statusCode: 400,
            message: 'RFID Tag already exists',
          });
        }

        req.body.image = imageLocalPath;
        if (fileLocalPath) req.body.file = fileLocalPath;
      }
      next();
    },
  ),
];
