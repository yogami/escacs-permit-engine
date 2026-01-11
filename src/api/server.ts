/**
 * ESCACS Permit Engine API Server
 */

import { serve } from '@hono/node-server';
import { swaggerUI } from '@hono/swagger-ui';
import { OpenAPIHono } from '@hono/zod-openapi';
import { cors } from 'hono/cors';
import { permitRoutes } from './routes/permits';
import process from 'node:process';

const app = new OpenAPIHono();

app.use('*', cors());

// Mount routes
app.route('/api/permits', permitRoutes);

// Health check
app.get('/api/health', (c) => c.json({ status: 'healthy', service: 'permit-engine' }));

const port = parseInt(process.env.PORT || '8080', 10);

// OpenAPI doc
app.doc('/api/openapi.json', {
    openapi: '3.0.0',
    info: {
        title: 'ESCACS Permit Intelligence API',
        version: '1.0.0',
        description: 'Regulatory Intelligence RAG Engine',
    },
    servers: [{ url: `http://localhost:${port}`, description: 'Local' }],
});

app.get('/api/docs', swaggerUI({ url: '/api/openapi.json' }));

console.log(`Permit Engine running on port ${port}`);

serve({
    fetch: app.fetch,
    port: port,
    hostname: '0.0.0.0'
});

export default app;
