import { test, expect } from '@playwright/test';

const BASE_URL = process.env.E2E_BASE_URL || 'http://localhost:3002';

test.describe('Permit Intelligence Engine E2E', () => {
    test('Health check returns 200', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/api/health`);
        expect(response.ok()).toBeTruthy();
        const body = await response.json();
        expect(body.status).toBe('healthy');
        expect(body.service).toBe('permit-engine');
    });

    test('Full Permit RAG Loop: Upload -> Index -> Query', async ({ request }) => {
        // 1. Upload & Index
        const uploadResponse = await request.post(`${BASE_URL}/api/permits/upload`, {
            data: {
                siteId: 'site-e2e-1',
                filename: 'state_permit.pdf',
                contentBase64: Buffer.from('Stabilization must be initiated within 14 days of lack of activity.').toString('base64')
            }
        });
        expect(uploadResponse.ok()).toBeTruthy();
        const uploadResult = await uploadResponse.json();
        expect(uploadResult.status).toBe('indexed');

        // 2. Query Requirement
        const queryResponse = await request.post(`${BASE_URL}/api/permits/query`, {
            data: {
                siteId: 'site-e2e-1',
                query: 'What are the stabilization requirements?'
            }
        });
        expect(queryResponse.ok()).toBeTruthy();
        const queryResult = await queryResponse.json();
        expect(queryResult.answer).toContain('14 days');
        expect(queryResult.confidence).toBeGreaterThan(0.8);
        expect(queryResult.sources).toContain('Stabilization');
    });

    test('OpenAPI documentation is available', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/api/openapi.json`);
        expect(response.ok()).toBeTruthy();
        const spec = await response.json();
        expect(spec.info.title).toContain('Permit Intelligence');
    });
});
