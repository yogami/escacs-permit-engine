/**
 * Permit API Routes
 */

import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { PermitParserService } from '../../lib/permit-engine/domain/services/PermitParserService';
import { LegalRAGService } from '../../lib/permit-engine/domain/services/LegalRAGService';
import { MockVectorStore, MockLLMAdapter, SimpleParserAdapter } from '../../lib/permit-engine/infrastructure/MockAdapters';

export const permitRoutes = new OpenAPIHono();

// DI (simplified for now)
const vectorStore = new MockVectorStore();
const llm = new MockLLMAdapter();
const parser = new SimpleParserAdapter();
const parserService = new PermitParserService(parser, llm, vectorStore);
const ragService = new LegalRAGService(vectorStore, llm);

// Schemas
const UploadSchema = z.object({
    siteId: z.string().openapi({ example: 'site-123' }),
    filename: z.string().openapi({ example: 'permit.pdf' }),
    contentBase64: z.string()
});

const QuerySchema = z.object({
    siteId: z.string().openapi({ example: 'site-123' }),
    query: z.string().openapi({ example: 'What are the stabilization rules?' })
});

// Routes
permitRoutes.openapi(
    createRoute({
        method: 'post',
        path: '/upload',
        summary: 'Upload and index permit',
        request: {
            body: { content: { 'application/json': { schema: UploadSchema } } }
        },
        responses: {
            200: { description: 'Permit indexed', content: { 'application/json': { schema: z.object({ id: z.string(), status: z.string() }) } } }
        }
    }),
    async (c) => {
        const { siteId, filename, contentBase64 } = c.req.valid('json');
        const buffer = Buffer.from(contentBase64, 'base64');
        const permit = await parserService.processPermit(siteId, filename, buffer);
        return c.json({ id: permit.id, status: 'indexed' });
    }
);

permitRoutes.openapi(
    createRoute({
        method: 'post',
        path: '/query',
        summary: 'Query permit requirements',
        request: {
            body: { content: { 'application/json': { schema: QuerySchema } } }
        },
        responses: {
            200: { description: 'Answer found', content: { 'application/json': { schema: z.any() } } }
        }
    }),
    async (c) => {
        const { siteId, query } = c.req.valid('json');
        const result = await ragService.answerQuery(siteId, query);
        return c.json(result);
    }
);
