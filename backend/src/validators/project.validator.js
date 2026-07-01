import { z } from 'zod';

const objectId = (field) => z
    .string({ required_error: `${field} is required`, invalid_type_error: `${field} must be a string` })
    .regex(/^[0-9a-fA-F]{24}$/, `Invalid MongoDB ObjectId format for ${field}`);

const emptyObject = z.object({}).passthrough();

const projectBodySchema = z.object({
    title: z
        .string({ required_error: 'Title is required', invalid_type_error: 'Title must be a string' })
        .min(3, 'Title must be at least 3 characters long')
        .max(200, 'Title must not exceed 200 characters'),
    description: z
        .string({ required_error: 'Description is required', invalid_type_error: 'Description must be a string' })
        .min(10, 'Description must be at least 10 characters long')
        .max(5000, 'Description must not exceed 5000 characters'),
    deadline: z
        .coerce
        .date({ required_error: 'Deadline is required', invalid_type_error: 'Deadline must be a valid date' })
        .refine((date) => date > new Date(), 'Deadline must be in the future'),
    price: z
        .number({ required_error: 'Price is required', invalid_type_error: 'Price must be a number' })
        .min(0, 'Price must be a non-negative number')
        .max(999999999, 'Price must not exceed 999999999'),
    skills_needed: z
        .array(
            z.string({ invalid_type_error: 'Each skill must be a string' })
                .min(1, 'Skill cannot be empty')
                .max(50, 'Skill must not exceed 50 characters')
        )
        .min(1, 'At least one skill is required')
        .max(20, 'Cannot have more than 20 skills'),
    category: z
        .string({ required_error: 'Category is required', invalid_type_error: 'Category must be a string' })
        .min(1, 'Category is required')
        .max(100, 'Category must not exceed 100 characters')
});

const submitProjectSchema = z.object({
    body: projectBodySchema,
    query: emptyObject,
    params: emptyObject
});

const viewProjectSchema = z.object({
    body: emptyObject.optional().default({}),
    query: z.object({
        projectId: objectId('projectId').optional()
    }).passthrough(),
    params: z.object({
        id: objectId('projectId').optional()
    }).passthrough()
});

const deleteProjectSchema = z.object({
    body: z.object({
        projectId: objectId('projectId').optional()
    }).passthrough(),
    query: z.object({
        projectId: objectId('projectId').optional()
    }).passthrough(),
    params: z.object({
        id: objectId('projectId').optional()
    }).passthrough()
}).refine(
    (data) => data.body.projectId || data.query.projectId || data.params.id,
    {
        message: 'Project ID is required',
        path: ['query', 'projectId']
    }
);

const updateProjectSchema = z.object({
    body: projectBodySchema
        .partial()
        .refine((data) => Object.keys(data).length > 0, 'At least one project field is required'),
    query: emptyObject,
    params: emptyObject
});

export { submitProjectSchema, viewProjectSchema, deleteProjectSchema, updateProjectSchema };
