import express from "express"
const router=express.Router();
import { editProfileSchema, viewProfileSchema, deleteProfileSchema, partialUpdateProfileSchema } from "../validators/profile.validator.js"
import validate from "../middlewares/error.middleware.js"
import profilesController from '../controllers/profile/index.js';
import {requireAuth} from "../middlewares/auth.middleware.js"


//functions for profile routes
router.get('/view',validate(viewProfileSchema),requireAuth, profilesController.getProfile)
router.put('/edit',validate(editProfileSchema),requireAuth ,profilesController.updateProfile)
router.get('/allProfiles',profilesController.getAllProfiles)
router.delete('/delete',validate(deleteProfileSchema),requireAuth ,profilesController.deleteProfile)
router.get('/filteredProfiles',profilesController.getFilteredProfiles)
export default router;