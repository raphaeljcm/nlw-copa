import { FastifyInstance } from 'fastify';
import ShortUniqueId from 'short-unique-id';
import { z } from 'zod';

import { prisma } from '../lib/prisma';
import { authenticate } from '../plugins/authenticate';

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

    try {
      await request.jwtVerify();

      await prisma.poll.create({
        data: {
          title,
          code,
          ownerId: request.user.sub,

          participants: {
            create: {
              userId: request.user.sub,
            },
          },
        },
      });
    } catch {
      await prisma.poll.create({
        data: {
          title,
          code,
        },
      });
    }

    return reply.status(201).send({ code });
  });

  fastify.post(
    '/polls/:id/join',
    { onRequest: [authenticate] },
    async (request, reply) => {
      const joinPollBy = z.object({
        code: z.string(),
      });

      const { code } = joinPollBy.parse(request.body);

      const poll = await prisma.poll.findUnique({
        where: {
          code,
        },
        include: {
          participants: {
            where: {
              userId: request.user.sub,
            },
          },
        },
      });

      if (!poll) {
        return reply.status(404).send({
          message: 'Poll not found',
        });
      }

      if (poll.participants.length > 0) {
        return reply.status(400).send({
          message: 'You have already joined this poll',
        });
      }

      // If this poll doesn't have a owner, make this first user
      // trying to join the owner
      if (!poll.ownerId) {
        await prisma.poll.update({
          where: {
            id: poll.id,
          },
          data: {
            ownerId: request.user.sub,
          },
        });
      }

      await prisma.participant.create({
        data: {
          pollId: poll.id,
          userId: request.user.sub,
        },
      });

      return reply.status(201).send();
    },
  );
}
