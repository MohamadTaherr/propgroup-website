import express from 'express';
import { body, query } from 'express-validator';
import { 
  getAllProperties, 
  getProperty, 
  createProperty, 
  updateProperty, 
  deleteProperty,
  searchProperties 
} from '../controllers/property.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';

const router = express.Router();

// Validation rules
const propertyValidation = [
  body('title').notEmpty().trim(),
  body('price').isFloat({ min: 0 }),
  body('location').notEmpty().trim(),
  body('type').isIn(['HOUSE', 'APARTMENT', 'CONDO', 'COMMERCIAL', 'LAND']),
  body('description').optional().trim(),
  body('address').optional().trim(),
  body('bedrooms').optional().isInt({ min: 0 }),
  body('bathrooms').optional().isInt({ min: 0 }),
  body('area').optional().isFloat({ min: 0 }),
  body('features').optional().isArray(),
  body('images').optional().isArray()
];

const searchValidation = [
  query('q').optional().trim(),
  query('type').optional().isIn(['HOUSE', 'APARTMENT', 'CONDO', 'COMMERCIAL', 'LAND']),
  query('minPrice').optional().isFloat({ min: 0 }),
  query('maxPrice').optional().isFloat({ min: 0 }),
  query('location').optional().trim(),
  query('bedrooms').optional().isInt({ min: 0 }),
  query('bathrooms').optional().isInt({ min: 0 })
];

// Public routes
router.get('/', getAllProperties);
router.get('/search', searchValidation, validate, searchProperties);
router.get('/:id', getProperty);

// Protected routes (requires authentication)
router.post('/', protect, authorize('AGENT', 'ADMIN'), propertyValidation, validate, createProperty);
router.put('/:id', protect, authorize('AGENT', 'ADMIN'), propertyValidation, validate, updateProperty);
router.delete('/:id', protect, authorize('AGENT', 'ADMIN'), deleteProperty);

export default router;
