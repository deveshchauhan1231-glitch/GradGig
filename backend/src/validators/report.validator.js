import { z } from 'zod';

const objectId = (field) => z
    .string({ required_error: `${field} is required`, invalid_type_error: `${field} must be a string` })
    .regex(/^[0-9a-fA-F]{24}$/, `Invalid MongoDB ObjectId format for ${field}`);

const emptyObject = z.object({}).passthrough();

const submitReportSchema = z.object({
    body: z.object({
        reporterId: objectId('reporterId'),
        reportedId: objectId('reportedId'),
        reason: z
            .string({ required_error: 'Reason is required', invalid_type_error: 'Reason must be a string' })
            .min(1, 'Reason is required')
    }),
    query: emptyObject,
    params: emptyObject
});

const viewReportSchema = z.object({
    body: emptyObject,
    query: z.object({
        reportId: objectId('reportId').optional()
    }).passthrough(),
    params: z.object({
        id: objectId('reportId').optional()
    }).passthrough()
});

const deleteReportSchema = z.object({
    body: z.object({
        reportId: objectId('reportId').optional()
    }).passthrough(),
    query: z.object({
        reportId: objectId('reportId').optional()
    }).passthrough(),
    params: z.object({
        id: objectId('reportId').optional()
    }).passthrough()
}).refine(
    (data) => data.body.reportId || data.query.reportId || data.params.id,
    {
        message: 'Report ID is required',
        path: ['query', 'reportId']
    }
);

export { submitReportSchema, viewReportSchema, deleteReportSchema };
