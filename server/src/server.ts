import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import Fastify from 'fastify';

import { authRoutes } from './routes/auth';
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
  await fastify.register(authRoutes);

  await fastify.register(jwt, {
    secret: process.env.JWT_SECRET!,
  });

  // the host is for working on mobile
  await fastify.listen({ port: 3333 /*host: '0.0.0.0'*/ });
}

bootstrap();
