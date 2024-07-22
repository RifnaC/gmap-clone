import express from 'express';
import { login, register, verified } from '../controllers/authController.js';
const router = express.Router();


// Register Route
router.post('/register', register);

// Verify Email Route
router.get('/verify/:token', verified);

// Login Route
router.post('/login', login);

export default router;
