import express from "express"
import { 
    getUserProfile,
    updateUserProfile,
    deleteUserProfile,
    listUserProfiles
 } from "../controllers/user.controller.js"
import { authenticate } from "../middleware/auth.middleware.js"

const router = express.Router();
/**
 * @swagger
 * /users/profiles:
 *   get:
 *     security: 
 *        - bearerAuth: []
 *     summary: Get a list of all users
 *     tags: [Users]
 *     parameters:
 *        - in: query
 *          name: page
 *          schema:
 *             type: integer
 *          description: Page number
 *        - in: query
 *          name: size
 *          schema:
 *             type: integer
 *          description: Size of users per page
 *        - in: query
 *          name: sortBy
 *          schema:
 *             type: String
 *          description: Field to sort by in our case [email, username]
 *        - in: query
 *          name: orderBy
 *          schema:
 *             type: String
 *          description: Order of sorted items [asc, desc]
 *        - in: query
 *          name: username
 *          schema:
 *             type: String
 *          description: filter by a specific username
 *        - in: query
 *          name: email
 *          schema:
 *             type: String
 *          description: filter by a specific user email
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               data: {
 *                   "users": [
 *                       {
 *                           "_id": "usertest1id",
 *                           "username": "test1",
 *                           "email": "test1@test.com",
 *                           "createdAt": "2024-10-01T00:00:00.523Z",
 *                           "updatedAt": "2024-10-01T00:00:00.523Z",
 *                           "__v": 0
 *                       },
 *                       {
 *                           "_id": "usertest2id",
 *                           "username": "test2",
 *                           "email": "test2@test.com",
 *                           "createdAt": "2024-10-01T00:00:00.523ZZ",
 *                           "updatedAt": "2024-10-01T00:00:00.523Z",
 *                           "__v": 0
 *                       }
 *                   ],
 *                   "currentPage": 1,
 *                   "totalUsers": 6,
 *                   "totalNumberOfPages": 2
 *               }
 *       500:
 *         description: Error occurred while fetching users
 */
router.route("/profiles").get(listUserProfiles);

router
  .route("/profile")
  /**
 * @swagger
 * /users/profile:
 *   get:
 *     security: 
 *        - bearerAuth: []
 *     summary: Get user profile
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               {
 *                     "_id": "usertestid",
 *                     "username": "John Doe",
 *                     "email": "test.email@gmail.com"
 *               }
 */
  .get(authenticate, getUserProfile)
/**
 * @swagger
 * /users/profile:
 *   put:
 *     security: 
 *        - bearerAuth: []
 *     summary: Update user profile
 *     tags: [Users]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               email:
 *                 type: string
 *               username:
 *                 type: string
 *             example:
 *                email: "test@test.com"
 *                password: "password"
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               {
 *                     "_id": "usertestid",
 *                     "username": "John Doe",
 *                     "email": "test.email@gmail.com"
 *               }
 *       400:
 *         description: Bad Request
 *         content:
 *          application/json:
 *            example:
 *             message:
 *              errorResponse: {
 *                 "index": 0,
 *                 "code": 11000,
 *                 "errmsg": "E11000 duplicate key error collection: weather-app.users index: email_1 dup key: { email: \"Test.email@gmail.com\" }",
 *              }
 */
  .put(authenticate, updateUserProfile)
/**
 * @swagger
 * /users/profile:
 *   delete:
 *     security: 
 *        - bearerAuth: []
 *     summary: Delete a user
 *     tags: [Users]
 *     responses:
 *       204:
 *         description: User removed
 *       500:
 *         description: Failed to remove user
 */
  .delete(authenticate, deleteUserProfile)

export default router;