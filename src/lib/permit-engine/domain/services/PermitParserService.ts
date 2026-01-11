/**
 * PermitParserService - Domain Service
 */

import { PermitDocument } from '../entities/PermitDocument';
import { ComplianceRequirement } from '../entities/ComplianceRequirement';
import type { IDocumentParserPort, ILargeLanguageModelPort, IVectorStorePort } from '../../ports/interfaces';
import { Buffer } from 'node:buffer';

export class PermitParserService {
    constructor(
        private readonly parser: IDocumentParserPort,
        private readonly llm: ILargeLanguageModelPort,
        private readonly vectorStore: IVectorStorePort
    ) { }

    /**
     * Parse and index a permit document
     */
    async processPermit(siteId: string, filename: string, content: Buffer): Promise<PermitDocument> {
        const parsed = await this.parser.parsePdf(content);

        const permit = PermitDocument.create({
            id: crypto.randomUUID(),
            siteId,
            filename,
            sections: parsed.sections
        });

        await this.indexSections(permit);
        permit.markAsIndexed();

        return permit;
    }

    /**
     * Extract specific requirements from a permit
     */
    async extractRequirements(permit: PermitDocument): Promise<ComplianceRequirement[]> {
        const prompt = this.buildExtractionPrompt(permit);
        const response = await this.llm.generate(prompt);
        return this.parseRequirementsResponse(permit.id, response.text);
    }

    private async indexSections(permit: PermitDocument): Promise<void> {
        const docs = permit.sections.map(s => ({
            content: s.content,
            metadata: { permitId: permit.id, siteId: permit.siteId, sectionTitle: s.title }
        }));
        await this.vectorStore.addDocuments(docs);
    }

    private buildExtractionPrompt(permit: PermitDocument): string {
        return `Extract stormwater compliance requirements from this permit: ${permit.filename}. 
                Focus on inspection frequency and rainfall thresholds.`;
    }

    private parseRequirementsResponse(permitId: string, _text: string): ComplianceRequirement[] {
        // Simple mock parser for now, in a real scenario this would parse JSON from LLM
        return [
            ComplianceRequirement.create({
                id: crypto.randomUUID(),
                permitId,
                category: 'inspection',
                title: 'Storm Event Inspection',
                description: 'Inspection required after rainfall',
                parameterKey: 'rainfall_threshold',
                parameterValue: '0.5',
                sourceReference: 'Section 4'
            })
        ];
    }
}
