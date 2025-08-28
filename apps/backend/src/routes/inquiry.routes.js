import express from 'express';
import { body } from 'express-validator';
import { 
  createInquiry, 
  getAllInquiries, 
  getInquiry, 
  updateInquiryStatus,
  getUserInquiries 
} from '../controllers/inquiry.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';

const router = express.Router();

// Validation rules
const inquiryValidation = [
  body('name').notEmpty().trim(),
  body('email').isEmail().normalizeEmail(),
  body('phone').optional().trim(),
  body('message').notEmpty().trim(),
  body('propertyId').optional().isUUID()
];

const statusValidation = [
  body('status').isIn(['NEW', 'CONTACTED', 'IN_PROGRESS', 'CLOSED'])
];

// Public routes
router.post('/', inquiryValidation, validate, createInquiry);

// Protected routes
router.get('/', protect, authorize('AGENT', 'ADMIN'), getAllInquiries);
router.get('/my', protect, getUserInquiries);
router.get('/:id', protect, getInquiry);
router.patch('/:id/status', protect, authorize('AGENT', 'ADMIN'), statusValidation, validate, updateInquiryStatus);

export default router;
