/**
 * LegalRAGService Unit Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { LegalRAGService } from '../../../src/lib/permit-engine/domain/services/LegalRAGService';
import { MockLLMAdapter, MockVectorStore } from '../../../src/lib/permit-engine/infrastructure/MockAdapters';

describe('LegalRAGService', () => {
    let service: LegalRAGService;
    let llm: MockLLMAdapter;
    let vectorStore: MockVectorStore;

    beforeEach(() => {
        llm = new MockLLMAdapter();
        vectorStore = new MockVectorStore();
        service = new LegalRAGService(vectorStore, llm);
    });

    it('should answer a query using context from vector store', async () => {
        await vectorStore.addDocuments([
            { content: "Stabilization rules: 14 days.", metadata: { siteId: 'site-123', sectionTitle: 'Stabilization' } }
        ]);

        const result = await service.answerQuery('site-123', 'What are the stabilization rules?');

        expect(result.answer).toContain('14 days');
        expect(result.confidence).toBeGreaterThan(0.8);
        expect(result.sources).toContain('Stabilization');
    });

    it('should return no context answer when no documents match site', async () => {
        const result = await service.answerQuery('non-existent', 'any query');

        expect(result.confidence).toBe(0);
        expect(result.answer).toContain("couldn't find");
        expect(result.sources).toHaveLength(0);
    });
});
