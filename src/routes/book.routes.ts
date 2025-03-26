import { Router } from 'express';
import * as bookController from '../controllers/book.controllers.ts';
import { verifyRole, verifyToken } from '../middlewares/auth.middlewares.ts';
import { UserRole } from '../utils/role.ts';
import { upload } from '../middlewares/multer.middlewares.ts';
import { validateBook } from '../middlewares/validators/validate-book.ts';

const router: Router = Router();

// POST: /api/v1/books
router.route('/').post(
  verifyToken,
  verifyRole([UserRole.ADMIN, UserRole.LIBRARIAN]),
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'file', maxCount: 1 },
  ]),
  validateBook,
  bookController.createBook,
);

// GET: /api/v1/books
router.route('/').get(bookController.getAllBooks);

// GET: /api/v1/books/:id
router.route('/:id').get(bookController.getBookById);

// PUT: /api/v1/books/:id
router.route('/:id').put(verifyToken, bookController.updateBook);

// DELETE: /api/v1/books/:id
router.route('/:id').delete(verifyToken, bookController.deleteBook);

export default router;
