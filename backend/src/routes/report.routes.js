import express from 'express';
const router=express.Router();
import {submitReportSchema,viewReportSchema,deleteReportSchema} from "../validators/report.validator.js"
import validate from "../middlewares/error.middleware.js"
import {requireAuth} from "../middlewares/auth.middleware.js"
import reportController from "../controllers/report/index.js"

//functions for report routes
router.post('/submit',validate(submitReportSchema),requireAuth,reportController.submitReport)
router.get('/view',validate(viewReportSchema),requireAuth,reportController.getReport)
router.delete('/delete',validate(deleteReportSchema),requireAuth,reportController.deleteReport )
export default router;