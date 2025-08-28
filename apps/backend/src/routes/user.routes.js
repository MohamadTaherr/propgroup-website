import express from 'express';
import { body } from 'express-validator';
import { 
  getAllUsers, 
  getUser, 
  updateUser, 
  deleteUser,
  updateProfile 
} from '../controllers/user.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';

const router = express.Router();

// Validation rules
const updateProfileValidation = [
  body('name').optional().trim().notEmpty(),
  body('email').optional().isEmail().normalizeEmail(),
  body('password').optional().isLength({ min: 6 })
];

const updateUserValidation = [
  body('name').optional().trim().notEmpty(),
  body('email').optional().isEmail().normalizeEmail(),
  body('role').optional().isIn(['USER', 'AGENT', 'ADMIN'])
];

// Protected routes
router.get('/profile', protect, getUser);
router.put('/profile', protect, updateProfileValidation, validate, updateProfile);

// Admin only routes
router.get('/', protect, authorize('ADMIN'), getAllUsers);
router.get('/:id', protect, authorize('ADMIN'), getUser);
router.put('/:id', protect, authorize('ADMIN'), updateUserValidation, validate, updateUser);
router.delete('/:id', protect, authorize('ADMIN'), deleteUser);

export default router;
