/**
 * Infrastructure Adapters
 */

import type { IVectorStorePort, SearchResult, ILargeLanguageModelPort, LLMResponse, IDocumentParserPort, ParsedDocument } from '../ports/interfaces';
import { Buffer } from 'node:buffer';

export class MockVectorStore implements IVectorStorePort {
    private documents: { content: string; metadata: any }[] = [];

    async addDocuments(docs: { content: string; metadata: any }[]): Promise<void> {
        this.documents.push(...docs);
    }

    async search(query: string, limit: number = 3): Promise<SearchResult[]> {
        // Very basic mock search (string includes)
        const queryLower = query.toLowerCase();
        return this.documents
            .filter(d => d.content.toLowerCase().includes(queryLower) || queryLower.includes('stabilization'))
            .slice(0, limit)
            .map(d => ({
                content: d.content,
                score: 0.9,
                metadata: d.metadata
            }));
    }
}

export class MockLLMAdapter implements ILargeLanguageModelPort {
    async generate(prompt: string): Promise<LLMResponse> {
        if (prompt.includes('stabilization')) {
            return {
                text: "Stabilization must be initiated within 14 days of lack of activity.",
                confidence: 0.95
            };
        }
        return {
            text: "Based on the permit, standard inspection frequency applies.",
            confidence: 0.85
        };
    }
}

export class SimpleParserAdapter implements IDocumentParserPort {
    async parsePdf(_content: Buffer): Promise<ParsedDocument> {
        return {
            text: "Mock permit content",
            sections: [
                { title: "General Info", content: "This is a municipal permit." },
                { title: "Stabilization", content: "Bare soil requires stabilization within 14 days." },
                { title: "Inspections", content: "Inspect after 0.5 inches of rain." }
            ]
        };
    }
}
