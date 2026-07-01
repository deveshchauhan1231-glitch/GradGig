import express from 'express';
const router=express.Router();
import projectController from '../controllers/project/index.js';
import validate from '../middlewares/error.middleware.js';
import {requireAuth} from "../middlewares/auth.middleware.js"

import { submitProjectSchema, viewProjectSchema, deleteProjectSchema, updateProjectSchema } from "../validators/project.validator.js"
//functions for project routes
router.post('/submit',validate(submitProjectSchema),requireAuth, projectController.submitProject)
router.get('/viewByMe',validate(viewProjectSchema), requireAuth, projectController.getProjectByMe)
router.get('/viewForMe',validate(viewProjectSchema),requireAuth, projectController.getProjectForMe)
router.delete('/delete',validate(deleteProjectSchema), requireAuth,projectController.deleteProject)
router.get('/allProjects', projectController.getAllProjects)
router.get('/view',validate(viewProjectSchema), projectController.getProject)
router.post('/markCompleted', requireAuth, projectController.markProjectCompleted)
router.get('/filteredProjects', projectController.getFilteredProjects)
export default router;