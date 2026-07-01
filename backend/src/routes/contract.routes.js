import express from "express";
const router=express.Router();
import contractController from "../controllers/contract/index.js"
import {createContractSchema,getContractSchema,deleteContractSchema} from "../validators/contract.validator.js"
import validate from "../middlewares/error.middleware.js";
import {requireAuth} from "../middlewares/auth.middleware.js"
//functions for contract routes
router.post('/submit',validate(createContractSchema), requireAuth,contractController.submitContract)
router.get('/viewByMe',validate(getContractSchema), requireAuth,contractController.getContractByMe)
router.get('/viewForMe',validate(getContractSchema),requireAuth, contractController.getContractForMe)
router.post('/markCompleted', requireAuth, contractController.markContractCompleted)
router.delete('/delete',validate(deleteContractSchema),requireAuth, contractController.deleteContract)
export default router;