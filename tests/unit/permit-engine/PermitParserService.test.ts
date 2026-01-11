/**
 * PermitParserService Unit Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { PermitParserService } from '../../../src/lib/permit-engine/domain/services/PermitParserService';
import { SimpleParserAdapter, MockLLMAdapter, MockVectorStore } from '../../../src/lib/permit-engine/infrastructure/MockAdapters';
import { Buffer } from 'node:buffer';

describe('PermitParserService', () => {
    let service: PermitParserService;
    let parser: SimpleParserAdapter;
    let llm: MockLLMAdapter;
    let vectorStore: MockVectorStore;

    beforeEach(() => {
        parser = new SimpleParserAdapter();
        llm = new MockLLMAdapter();
        vectorStore = new MockVectorStore();
        service = new PermitParserService(parser, llm, vectorStore);
    });

    it('should parse and index a permit document', async () => {
        const content = Buffer.from('test content');
        const permit = await service.processPermit('site-123', 'test.pdf', content);

        expect(permit.filename).toBe('test.pdf');
        expect(permit.isIndexed).toBe(true);
        expect(permit.sections.length).toBeGreaterThan(0);
    });

    it('should extract requirements from an indexed permit', async () => {
        const content = Buffer.from('test content');
        const permit = await service.processPermit('site-123', 'test.pdf', content);
        const requirements = await service.extractRequirements(permit);

        expect(requirements.length).toBeGreaterThan(0);
        expect(requirements[0].parameterKey).toBe('rainfall_threshold');
        expect(requirements[0].parameterValue).toBe('0.5');
    });
});
