import { Given, When, Then, Before } from '@cucumber/cucumber';
import { expect } from 'vitest';
import { PermitParserService } from '../../src/lib/permit-engine/domain/services/PermitParserService';
import { LegalRAGService } from '../../src/lib/permit-engine/domain/services/LegalRAGService';
import { SimpleParserAdapter, MockLLMAdapter, MockVectorStore } from '../../src/lib/permit-engine/infrastructure/MockAdapters';
import { Buffer } from 'node:buffer';
import { PermitDocument } from '../../src/lib/permit-engine/domain/entities/PermitDocument';
import { ComplianceRequirement } from '../../src/lib/permit-engine/domain/entities/ComplianceRequirement';

interface World {
    parserService: PermitParserService;
    ragService: LegalRAGService;
    filename?: string;
    siteId?: string;
    permit?: PermitDocument;
    requirements?: ComplianceRequirement[];
    queryResult?: any;
}

const vectorStore = new MockVectorStore();
const llm = new MockLLMAdapter();
const parser = new SimpleParserAdapter();

Before(function (this: World) {
    this.parserService = new PermitParserService(parser, llm, vectorStore);
    this.ragService = new LegalRAGService(vectorStore, llm);
});

Given('a stormwater permit PDF named {string}', async function (this: World, filename: string) {
    this.filename = filename;
});

When('I upload the {string} to the intelligence engine', async function (this: World, filename: string) {
    this.permit = await this.parserService.processPermit('site-123', filename, Buffer.from('mock content'));
});

Then('the engine should extract the {string} requirement', async function (this: World, _requirement: string) {
    this.requirements = await this.parserService.extractRequirements(this.permit!);
    const found = this.requirements.find(r => r.category === 'inspection');
    expect(found).toBeDefined();
});

Then('the engine should identify the {string} as {string}', async function (this: World, key: string, value: string) {
    const requirement = this.requirements?.find(r => r.parameterKey === key);
    expect(requirement?.parameterValue).toBe(value);
});

Given('a permit document has been indexed for site {string}', async function (this: World, siteId: string) {
    this.siteId = siteId;
    this.permit = await this.parserService.processPermit(siteId, 'indexed_permit.pdf', Buffer.from('stabilization rules context'));
});

When('I query the engine with {string}', async function (this: World, query: string) {
    this.queryResult = await this.ragService.answerQuery(this.siteId!, query);
});

Then('I should receive an answer with a confidence score greater than {float}', async function (this: World, minScore: number) {
    expect(this.queryResult.confidence).toBeGreaterThan(minScore);
});

Then('the answer should reference the {string} section of the permit', async function (this: World, section: string) {
    expect(this.queryResult.sources).toContain(section);
});
