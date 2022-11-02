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
  fastify.get('/pools/count', async () => {
    const count = await prisma.pool.count();

    return { count };
  });

  fastify.post('/pools', async (request, reply) => {
    const createdPoolBody = z.object({
      title: z.string(),
    });

    const { title } = createdPoolBody.parse(request.body);

    // Creating the pool code
    const generate = new ShortUniqueId({ length: 6 });
    const code = String(generate()).toUpperCase();

    await prisma.pool.create({
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
