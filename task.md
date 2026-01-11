# ESCACS Permit Intelligence Engine

## Objective
Build a microservice that parses stormwater permit PDFs using RAG (Retrieval-Augmented Generation) to extract inspection requirements and comply with Berlin AI Studio Gold Standards.

---

## Task Breakdown

### 1. Project Scaffolding
- [x] Create project structure
- [x] Initialize `package.json`
- [x] Link Berlin AI Studio rules via `install-brain.sh`
- [ ] Set up `tsconfig.json` and `vite.config.ts`
- [ ] Create `tests/setup.ts`

### 2. Acceptance Tests (ATDD)
- [ ] Write `permit-intelligence.feature`
- [ ] Create step definition stubs

### 3. Domain Implementation
- [ ] Entities: `PermitDocument`, `ComplianceRequirement`
- [ ] Services: `PermitParserService`, `LegalRAGService`
- [ ] Ports: `IVectorStorePort`, `ILargeLanguageModelPort`, `IDocumentParserPort`

### 4. Infrastructure Implementation
- [ ] `MockVectorStore` (in-memory)
- [ ] `LangChainAdapter` (OpenAI/Claude/Gemini)
- [ ] `PdfParseAdapter`

### 5. API Layer
- [ ] Hono router setup
- [ ] `/api/permits/upload` (POST)
- [ ] `/api/permits/query` (POST)
- [ ] `/api/health`

### 6. Gold Standards Compliance
- [ ] Cyclomatic Complexity ≤ 3 per function
- [ ] Unit Test Coverage ≥ 80%
- [ ] 100% Acceptance Test Pass Rate

### 7. Registration & Deployment
- [ ] Register in `Microservices_Catalog.md`
- [ ] Sync with Capability Broker
- [ ] Deploy to Railway
