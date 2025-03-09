import { Router } from 'express';
import * as bookController from '../controllers/book.controllers.ts';
import { verifyToken } from '../middlewares/auth.middlewares.ts';

const router: Router = Router();

// POST: /api/v1/books
router.route('/').post(verifyToken, bookController.createBook);

// GET: /api/v1/books
router.route('/').get(bookController.getAllBooks);

// GET: /api/v1/books/:id
router.route('/:id').get(bookController.getBookById);

// PUT: /api/v1/books/:id
router.route('/:id').put(verifyToken, bookController.updateBook);

// DELETE: /api/v1/books/:id
router.route('/:id').delete(verifyToken, bookController.deleteBook);

export default router;
