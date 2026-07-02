import { z } from 'zod';

const objectId = (field) => z
    .string({ required_error: `${field} is required`, invalid_type_error: `${field} must be a string` })
    .regex(/^[0-9a-fA-F]{24}$/, `Invalid MongoDB ObjectId format for ${field}`);

const emptyObject = z.object({}).passthrough();

const profileBodySchema = z.object({
    name: z
        .string({ required_error: 'Name is required', invalid_type_error: 'Name must be a string' })
        .min(2, 'Name must be at least 2 characters long')
        .max(100, 'Name must not exceed 100 characters'),
        
    age: z
        .number({ required_error: 'Age is required', invalid_type_error: 'Age must be a number' })
        .int('Age must be an integer')
        .min(18, 'Age must be at least 18')
        .max(100, 'Age must not exceed 100'),
    gender: z.enum(['male', 'female', 'other'], {
        errorMap: () => ({ message: 'Gender must be "male", "female", or "other"' })
    }),
    college: z
        .string({ required_error: 'College is required', invalid_type_error: 'College must be a string' })
        .min(2, 'College name must be at least 2 characters long')
        .max(200, 'College name must not exceed 200 characters'),
    location: z
        .string({ required_error: 'Location is required', invalid_type_error: 'Location must be a string' })
        .min(2, 'Location must be at least 2 characters long')
        .max(200, 'Location must not exceed 200 characters'),
    skills: z
        .array(
            z.string({ invalid_type_error: 'Each skill must be a string' })
                .min(1, 'Skill cannot be empty')
                .max(50, 'Skill must not exceed 50 characters')
        )
        .default([])
        .optional()
});

const editProfileSchema = z.object({
    body: profileBodySchema,
    query: emptyObject,
    params: emptyObject
});

const viewProfileSchema = z.object({
    
    query: z.object({
        id: objectId('id').optional()
    }).passthrough(),
    params: emptyObject
});

const deleteProfileSchema = z.object({
    body: emptyObject,
    query: emptyObject,
    params: emptyObject
});

const partialUpdateProfileSchema = z.object({
    body: profileBodySchema
        .partial()
        .refine((data) => Object.keys(data).length > 0, 'At least one profile field is required'),
    query: emptyObject,
    params: emptyObject
});

export { editProfileSchema, viewProfileSchema, deleteProfileSchema, partialUpdateProfileSchema };
