import cors from '@fastify/cors';
import Fastify from 'fastify';

import { guessRoutes } from './routes/guess';
import { pollRoutes } from './routes/poll';
import { userRoutes } from './routes/user';

async function bootstrap() {
  const fastify = Fastify({
    logger: true,
  });

  // Middlewares
  await fastify.register(cors, {
    origin: true,
  });

  await fastify.register(pollRoutes);
  await fastify.register(userRoutes);
  await fastify.register(guessRoutes);

  // the host is for working on mobile
  await fastify.listen({ port: 3333 /*host: '0.0.0.0'*/ });
}

bootstrap();
