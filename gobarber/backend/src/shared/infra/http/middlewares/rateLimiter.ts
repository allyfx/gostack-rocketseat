import AppError from '@shared/errors/AppError';

import { Request, Response, NextFunction } from 'express';
import redis from 'redis';
import { RateLimiterRedis } from 'rate-limiter-flexible';

const redisClient = redis.createClient({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    password: process.env.REDIS_PASS || undefined,
});

const lLimiter = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: 'rateLimit',
    points: 5,
    duration: 1,
});

export default async function rateLimiter(
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> {
    try {
        await lLimiter.consume(request.ip);

        return next();
    } catch (err) {
        throw new AppError('Too many requests', 429);
    }
}
