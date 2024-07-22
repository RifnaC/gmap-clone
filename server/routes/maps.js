import express from 'express';
const router = express.Router();
import { authMiddleware } from '../middlewares/authMiddlewares.js';
import { deletedSearchHistory, searchHistory, searchLocation } from '../controllers/mapController.js';

// Search Location
router.post('/search', authMiddleware, searchLocation);

// Get Search History
router.get('/history', authMiddleware, searchHistory);

// Delete Search History Item
router.delete('/history/:id', authMiddleware, deletedSearchHistory);

export default router;
