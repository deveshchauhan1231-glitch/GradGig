import { z } from 'zod';

const objectId = (field) => z
    .string({ required_error: `${field} is required`, invalid_type_error: `${field} must be a string` })
    .regex(/^[0-9a-fA-F]{24}$/, `Invalid MongoDB ObjectId format for ${field}`);

const emptyObject = z.object({}).passthrough();

const proposalBodySchema = z.object({
    clientId: objectId('clientId'),
    providerId: objectId('providerId').optional(),
    projectId: objectId('projectId').optional(),
    title: z
        .string({ required_error: 'Title is required', invalid_type_error: 'Title must be a string' })
        .min(3, 'Title must be at least 3 characters long')
        .max(200, 'Title must not exceed 200 characters'),
    description: z
        .string({ required_error: 'Description is required', invalid_type_error: 'Description must be a string' })
        .min(10, 'Description must be at least 10 characters long')
        .max(5000, 'Description must not exceed 5000 characters'),
    price: z
        .number({ required_error: 'Price is required', invalid_type_error: 'Price must be a number' })
        .min(0, 'Price must be a non-negative number')
        .max(999999999, 'Price must not exceed 999999999'),
    deadline: z
        .coerce
        .date({ required_error: 'Deadline is required', invalid_type_error: 'Deadline must be a valid date' })
        .refine((date) => date > new Date(), 'Deadline must be in the future')
});

const submitProposalSchema = z.object({
    body: proposalBodySchema.refine(
        (data) => !data.providerId || data.clientId !== data.providerId,
        {
            message: 'Client and provider cannot be the same user',
            path: ['providerId']
        }
    ),
    query: emptyObject,
    params: emptyObject
});

const viewProposalSchema = z.object({
    body: emptyObject.optional().default({}),
    query: z.object({
        proposalId: objectId('proposalId').optional(),
        proposalType: z.enum(['forProject', 'forService']).optional()
    }).passthrough(),
    params: z.object({
        id: objectId('proposalId').optional(),
        type: z.enum(['forProject', 'forService']).optional()
    }).passthrough()
});

const deleteProposalSchema = z.object({
    body: z.object({
        proposalId: objectId('proposalId').optional()
    }).passthrough(),
    query: z.object({
        proposalId: objectId('proposalId').optional(),
        proposalType: z.enum(['forProject', 'forService']).optional()
    }).passthrough(),
    params: z.object({
        id: objectId('proposalId').optional(),
        type: z.enum(['forProject', 'forService']).optional()
    }).passthrough()
}).refine(
    (data) => data.body.proposalId || data.query.proposalId || data.params.id,
    {
        message: 'Proposal ID is required',
        path: ['query', 'proposalId']
    }
);

const updateProposalVerdictSchema = z.object({
    body: z.object({
        proposalId: objectId('proposalId'),
        verdict: z.boolean({ required_error: 'Verdict is required', invalid_type_error: 'Verdict must be a boolean value' })
    }).passthrough(),
    query: emptyObject,
    params: emptyObject
});

const updateProposalSchema = z.object({
    body: proposalBodySchema
        .omit({ clientId: true, providerId: true })
        .partial()
        .refine((data) => Object.keys(data).length > 0, 'At least one proposal field is required'),
    query: emptyObject,
    params: emptyObject
});

export {
    submitProposalSchema,
    viewProposalSchema,
    deleteProposalSchema,
    updateProposalVerdictSchema,
    updateProposalSchema
};
