import express from 'express';
import { register, login, verify, users } from '../controllers/authController.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get("/verify", verify)
router.get("/users", users)

export default router;