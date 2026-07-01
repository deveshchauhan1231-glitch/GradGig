import express from 'express';

const router=express.Router();
import proposalController from '../controllers/proposal/index.js';
import { 
    submitProposalSchema, 
    viewProposalSchema, 
    deleteProposalSchema, 
    updateProposalVerdictSchema,
    updateProposalSchema 
} from "../validators/proposal.validator.js"
import {requireAuth} from "../middlewares/auth.middleware.js"

import validate from "../middlewares/error.middleware.js"
//functions for proposal routes
router.post('/submit',validate(submitProposalSchema),requireAuth,proposalController.submitProposal)
router.get('/viewByMe',validate(viewProposalSchema),requireAuth ,proposalController.getProposalByMe)
router.get('/viewForMe',validate(viewProposalSchema),requireAuth, proposalController.getProposalForMe)
router.get('/acceptProposal',validate(viewProposalSchema), requireAuth,proposalController.acceptProposal)
router.post('/rejectProposal',validate(deleteProposalSchema),requireAuth,proposalController.rejectProposal)
router.delete('/delete',validate(deleteProposalSchema),requireAuth,proposalController.deleteProposal)
export default router;