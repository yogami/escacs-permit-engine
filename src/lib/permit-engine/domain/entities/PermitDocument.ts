/**
 * PermitDocument - Domain Entity
 * 
 * Represents a parsed permit document with metadata and indexing status.
 */

export interface PermitDocumentProps {
    id: string;
    siteId: string;
    filename: string;
    uploadedAt: Date;
    sections: PermitSection[];
    isIndexed: boolean;
}

export interface PermitSection {
    title: string;
    content: string;
    pageNumber?: number;
}

export class PermitDocument {
    readonly id: string;
    readonly siteId: string;
    readonly filename: string;
    readonly uploadedAt: Date;
    readonly sections: PermitSection[];
    private _isIndexed: boolean;

    constructor(props: PermitDocumentProps) {
        this.id = props.id;
        this.siteId = props.siteId;
        this.filename = props.filename;
        this.uploadedAt = props.uploadedAt;
        this.sections = props.sections;
        this._isIndexed = props.isIndexed;
    }

    static create(props: Omit<PermitDocumentProps, 'isIndexed' | 'uploadedAt'>): PermitDocument {
        return new PermitDocument({
            ...props,
            uploadedAt: new Date(),
            isIndexed: false,
        });
    }

    get isIndexed(): boolean {
        return this._isIndexed;
    }

    markAsIndexed(): void {
        this._isIndexed = true;
    }
}
