import { z } from 'zod';

const objectId = (field) => z
    .string({ required_error: `${field} is required`, invalid_type_error: `${field} must be a string` })
    .regex(/^[0-9a-fA-F]{24}$/, `Invalid MongoDB ObjectId format for ${field}`);

const emptyObject = z.object({}).passthrough();

const createContractSchema = z.object({
    body: z.object({
        providerId: objectId('providerId'),
        clientId: objectId('clientId'),
        projectId: objectId('projectId').optional(),
        title: z
            .string({ required_error: 'Title is required', invalid_type_error: 'Title must be a string' })
            .min(3, 'Title must be at least 3 characters long')
            .max(200, 'Title must not exceed 200 characters'),
        description: z
            .string({ required_error: 'Description is required', invalid_type_error: 'Description must be a string' })
            .min(1, 'Description is required'),
        price: z
            .number({ required_error: 'Price is required', invalid_type_error: 'Price must be a number' })
            .min(0, 'Price must be a non-negative number'),
        deadline: z
            .coerce
            .date({ required_error: 'Deadline is required', invalid_type_error: 'Deadline must be a valid date' })
            .refine((date) => date > new Date(), 'Deadline must be in the future')
    }),
    query: emptyObject,
    params: emptyObject
});

const getContractSchema = z.object({
    body: emptyObject.optional().default({}),
    query: z.object({
        id: objectId('id').optional()
    }).passthrough(),
    params: z.object({
        id: objectId('id').optional()
    }).passthrough()
});

const deleteContractSchema = z.object({
    body: z.object({
        contractId: objectId('contractId').optional()
    }).passthrough(),
    query: z.object({
        contractId: objectId('contractId').optional(),
        id: objectId('id').optional()
    }).passthrough(),
    params: z.object({
        id: objectId('contractId').optional()
    }).passthrough()
}).refine(
    (data) => data.body.contractId || data.query.contractId || data.query.id || data.params.id,
    {
        message: 'Contract ID is required',
        path: ['query', 'contractId']
    }
);

export { createContractSchema, getContractSchema, deleteContractSchema };
