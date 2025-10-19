import { createRoute } from '@hono/zod-openapi';
import { UserProfileSchema } from '../schema/users-schema';
import { z } from 'zod';

export const getMyInfo = createRoute({
  method: 'get',
  path: '/myinfo',
  tags: ['Users'],
  summary: 'Get current user profile',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),
            data: UserProfileSchema,
          }),
        },
      },
      description: 'Successful Response',
    },
    401: { description: 'Unauthorized' },
    404: { description: 'User not found' },
  },
});
