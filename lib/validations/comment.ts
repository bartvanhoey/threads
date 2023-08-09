import * as z from 'zod';

export const CommentValidation = z.object({
    thread: z.string().nonempty().min(3, {message: 'Thread must be at least 3 characters long.'}).max(1000, {message: 'Thread must be at most 1000 characters long.'}),
});