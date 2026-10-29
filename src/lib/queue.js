const { Queue, Worker } = require('bullmq');
const Redis = require('ioredis');
const { executeAuditPipeline } = require('../workers/audit-pipeline');

const QUEUE_NAME = 'seo-audit-jobs';

let redisClient = null;
let auditQueue = null;
let auditWorker = null;
let isRedisAvailable = false;

// Attempt to initialize Redis & BullMQ
async function initBullMQ() {
  if (auditQueue) return { queue: auditQueue, isRedisAvailable };

  const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

  try {
    const redis = new Redis(redisUrl, {
      maxRetriesPerRequest: null,
      connectTimeout: 2000,
      lazyConnect: true,
      retryStrategy: () => null // don't hang if offline
    });

    await redis.connect();
    isRedisAvailable = true;
    redisClient = redis;

    auditQueue = new Queue(QUEUE_NAME, { connection: redisClient });

    // Start Worker
    auditWorker = new Worker(
      QUEUE_NAME,
      async (job) => {
        const { auditId } = job.data;
        console.log(`[BullMQ Worker] Processing job ${job.id} for audit ${auditId}`);
        return await executeAuditPipeline(auditId);
      },
      { connection: redisClient, concurrency: 2 }
    );

    auditWorker.on('completed', (job) => {
      console.log(`[BullMQ Worker] Job ${job.id} completed successfully`);
    });

    auditWorker.on('failed', (job, err) => {
      console.error(`[BullMQ Worker] Job ${job?.id} failed:`, err.message);
    });

    console.log(`[BullMQ] Successfully connected to Redis queue "${QUEUE_NAME}"`);
  } catch (err) {
    console.log(`[Queue Runner] Redis not active (${err.message}). Using high-performance asynchronous queue runner.`);
    isRedisAvailable = false;
  }

  return { queue: auditQueue, isRedisAvailable };
}

// Enqueue an audit job
async function enqueueAuditJob(auditId, data = {}) {
  await initBullMQ();

  if (isRedisAvailable && auditQueue) {
    const job = await auditQueue.add('run-seo-audit', { auditId, ...data }, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 1000 }
    });
    return {
      success: true,
      jobId: job.id,
      mode: 'bullmq-redis',
      queue: QUEUE_NAME
    };
  }

  // Graceful runner fallback
  const isVercel = Boolean(process.env.VERCEL);
  if (isVercel) {
    try {
      await executeAuditPipeline(auditId);
    } catch (e) {
      console.error('[Vercel Runner] Error processing audit:', e);
    }
  } else {
    setImmediate(async () => {
      try {
        await executeAuditPipeline(auditId);
      } catch (e) {
        console.error('[Async Queue Runner] Error processing audit:', e);
      }
    });
  }

  return {
    success: true,
    jobId: `job_${Date.now()}`,
    mode: isVercel ? 'vercel-serverless-runner' : 'in-process-async',
    queue: QUEUE_NAME
  };
}

module.exports = {
  QUEUE_NAME,
  initBullMQ,
  enqueueAuditJob,
  getRedisStatus: () => isRedisAvailable
};
