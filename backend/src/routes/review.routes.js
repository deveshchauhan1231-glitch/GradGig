import express from 'express';
const router=express.Router();
import {submitReviewSchema,viewReviewSchema,deleteReviewSchema} from "../validators/review.validator.js"
import validate from "../middlewares/error.middleware.js"
import {requireAuth} from "../middlewares/auth.middleware.js"
import reviewController from "../controllers/review/index.js"

//functions for report routes
router.post('/submit',validate(submitReviewSchema),requireAuth,reviewController.submitReview)
router.get('/view',validate(viewReviewSchema),requireAuth,reviewController.getReview)
router.delete('/delete',validate(deleteReviewSchema),requireAuth,reviewController.deleteReview)

export default router;