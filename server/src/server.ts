import cors from '@fastify/cors';
import { PrismaClient } from '@prisma/client';
import Fastify from 'fastify';
import ShortUniqueId from 'short-unique-id';
import { z } from 'zod';

const prisma = new PrismaClient({
  log: ['query'],
});

async function bootstrap() {
  const fastify = Fastify({
    logger: true,
  });

  // Middlewares
  await fastify.register(cors, {
    origin: true,
  });

  // Routes
  fastify.get('/polls/count', async () => {
    const count = await prisma.poll.count();

    return { count };
  });

  fastify.get('/users/count', async () => {
    const count = await prisma.user.count();

    return { count };
  });

  fastify.get('/guesses/count', async () => {
    const count = await prisma.guess.count();

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

  // the host is for working on mobile
  await fastify.listen({ port: 3333 /*host: '0.0.0.0'*/ });
}

bootstrap();
