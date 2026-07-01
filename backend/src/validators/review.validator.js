import { z } from 'zod';

const objectId = (field) => z
    .string({ required_error: `${field} is required`, invalid_type_error: `${field} must be a string` })
    .regex(/^[0-9a-fA-F]{24}$/, `Invalid MongoDB ObjectId format for ${field}`);

const emptyObject = z.object({}).passthrough();

const submitReviewSchema = z.object({
    body: z.object({
        reviewerId: objectId('reviewerId'),
        reviewedId: objectId('reviewedId'),
        review: z
            .string({ invalid_type_error: 'Review must be a string' })
            .optional(),
        rating: z
            .number({ required_error: 'Rating is required', invalid_type_error: 'Rating must be a number' })
            .min(1, 'Minimum rating is 1')
            .max(5, 'Maximum rating must be 5')
    }),
    query: emptyObject,
    params: emptyObject
});

const viewReviewSchema = z.object({
    body: emptyObject,
    query: z.object({
        reviewId: objectId('reviewId').optional()
    }).passthrough(),
    params: z.object({
        id: objectId('reviewId').optional()
    }).passthrough()
});

const deleteReviewSchema = z.object({
    body: z.object({
        reviewId: objectId('reviewId').optional()
    }).passthrough(),
    query: z.object({
        reviewId: objectId('reviewId').optional()
    }).passthrough(),
    params: z.object({
        id: objectId('reviewId').optional()
    }).passthrough()
}).refine(
    (data) => data.body.reviewId || data.query.reviewId || data.params.id,
    {
        message: 'Review ID is required',
        path: ['query', 'reviewId']
    }
);

export { submitReviewSchema, viewReviewSchema, deleteReviewSchema };
