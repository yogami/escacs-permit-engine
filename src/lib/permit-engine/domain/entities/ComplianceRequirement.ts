/**
 * ComplianceRequirement - Domain Entity
 * 
 * Represents a specific rule extracted from a permit.
 */

export type RequirementCategory = 'inspection' | 'stabilization' | 'reporting' | 'bmp';

export interface ComplianceRequirementProps {
    id: string;
    permitId: string;
    category: RequirementCategory;
    title: string;
    description: string;
    parameterKey?: string; // e.g., 'rainfall_threshold'
    parameterValue?: string; // e.g., '0.5'
    sourceReference: string; // e.g., 'Section 4.2'
}

export class ComplianceRequirement {
    readonly id: string;
    readonly permitId: string;
    readonly category: RequirementCategory;
    readonly title: string;
    readonly description: string;
    readonly parameterKey: string | null;
    readonly parameterValue: string | null;
    readonly sourceReference: string;

    constructor(props: ComplianceRequirementProps) {
        this.id = props.id;
        this.permitId = props.permitId;
        this.category = props.category;
        this.title = props.title;
        this.description = props.description;
        this.parameterKey = props.parameterKey ?? null;
        this.parameterValue = props.parameterValue ?? null;
        this.sourceReference = props.sourceReference;
    }

    static create(props: ComplianceRequirementProps): ComplianceRequirement {
        return new ComplianceRequirement(props);
    }
}
