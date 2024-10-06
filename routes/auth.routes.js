import express from "express";
import { register, login } from "../controllers/auth.controller.js"

const router = express.Router();
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register new user.
 *     tags: [Auth]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               username:
 *                 type: string
 *             example:
 *                email: "test@test.com"
 *                username: "John Doe"
 *                password: "password"
 *     responses:
 *       201:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               _id: 123,
 *               username: "John Doe"
 *               email: "test@test.com"
 *       400:
 *         description: Invalid user data
 */
router.post("/register", register);
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user.
 *     tags: [Auth]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *                email: "test@test.com"
 *                password: "password"
 *     responses:
 *       201:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *                token: "test_token"
 *       401:
 *         description: Incorrect password
 *       404:
 *         description: User not found
 */
router.post("/login", login);

export default router;
