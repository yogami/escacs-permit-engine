import { Buffer } from 'node:buffer';

export interface ParsedDocument {
    text: string;
    sections: { title: string; content: string }[];
}

export interface IDocumentParserPort {
    parsePdf(content: Buffer): Promise<ParsedDocument>;
}

/**
 * ILargeLanguageModelPort - Interface
 */

export interface LLMResponse {
    text: string;
    confidence: number;
    metadata?: any;
}

export interface ILargeLanguageModelPort {
    generate(prompt: string): Promise<LLMResponse>;
}

/**
 * IVectorStorePort - Interface
 */

export interface SearchResult {
    content: string;
    score: number;
    metadata: any;
}

export interface IVectorStorePort {
    addDocuments(docs: { content: string; metadata: any }[]): Promise<void>;
    search(query: string, limit?: number): Promise<SearchResult[]>;
}
