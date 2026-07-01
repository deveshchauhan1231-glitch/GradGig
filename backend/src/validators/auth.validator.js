import { z } from 'zod';

const emptyObject = z.object({}).passthrough();

const registerSchema = z.object({
    body: z.object({
        email: z
            .string({ required_error: 'Email is required', invalid_type_error: 'Email must be a string' })
            .email('Invalid email format'),
        password: z
            .string({ required_error: 'Password is required', invalid_type_error: 'Password must be a string' })
            .min(6, 'Password must be at least 6 characters long'),
        role: z
            .enum(['client', 'student'], {
                errorMap: () => ({ message: 'Role must be either "client" or "student"' })
            })
            .default('student')
    }),
    query: emptyObject,
    params: emptyObject
});

const loginSchema = z.object({
    body: z.object({
        email: z
            .string({ required_error: 'Email is required', invalid_type_error: 'Email must be a string' })
            .email('Invalid email format'),
        password: z
            .string({ required_error: 'Password is required', invalid_type_error: 'Password must be a string' })
            .min(1, 'Password is required')
    }),
    query: emptyObject,
    params: emptyObject
});

const logoutSchema = z.object({
    body: emptyObject,
    query: emptyObject,
    params: emptyObject
});

export { registerSchema, loginSchema, logoutSchema };
