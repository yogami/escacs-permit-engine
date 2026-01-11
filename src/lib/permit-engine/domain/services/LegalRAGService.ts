/**
 * LegalRAGService - Domain Service
 */

import type { IVectorStorePort, ILargeLanguageModelPort } from '../../ports/interfaces';

export interface RAGAnswer {
    answer: string;
    confidence: number;
    sources: string[];
}

export class LegalRAGService {
    constructor(
        private readonly vectorStore: IVectorStorePort,
        private readonly llm: ILargeLanguageModelPort
    ) { }

    /**
     * Answer a compliance query using RAG
     */
    async answerQuery(siteId: string, query: string): Promise<RAGAnswer> {
        const contexts = await this.vectorStore.search(query, 3);
        const filteredContexts = contexts.filter(c => c.metadata.siteId === siteId);

        if (filteredContexts.length === 0) {
            return this.createNoContextAnswer();
        }

        const prompt = this.buildRAGPrompt(query, filteredContexts);
        const response = await this.llm.generate(prompt);

        return {
            answer: response.text,
            confidence: response.confidence,
            sources: filteredContexts.map(c => c.metadata.sectionTitle)
        };
    }

    private buildRAGPrompt(query: string, contexts: any[]): string {
        const contextStr = contexts.map(c => c.content).join('\n\n');
        return `Answer the following question based on the provided permit sections:\n\nContext:\n${contextStr}\n\nQuestion: ${query}`;
    }

    private createNoContextAnswer(): RAGAnswer {
        return {
            answer: "I couldn't find any relevant information in the uploaded permit documents for this site.",
            confidence: 0,
            sources: []
        };
    }
}
