import { FastifyInstance } from 'fastify';
import ShortUniqueId from 'short-unique-id';
import { z } from 'zod';

import { prisma } from '../lib/prisma';

export async function pollRoutes(fastify: FastifyInstance) {
  fastify.get('/polls/count', async () => {
    const count = await prisma.poll.count();

    return { count };
  });

  fastify.post('/polls', async (request, reply) => {
    const createdPollBody = z.object({
      title: z.string(),
    });

    const { title } = createdPollBody.parse(request.body);

    // Creating the poll code
    const generate = new ShortUniqueId({ length: 6 });
    const code = String(generate()).toUpperCase();

    await prisma.poll.create({
      data: {
        title,
        code,
      },
    });

    return reply.status(201).send({ code });
  });
}
