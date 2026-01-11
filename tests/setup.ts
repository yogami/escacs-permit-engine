import { vi } from 'vitest';

// Global mocks if needed
vi.stubEnv('OPENAI_API_KEY', 'mock-key');
vi.stubEnv('ANTHROPIC_API_KEY', 'mock-key');
vi.stubEnv('GOOGLE_AI_API_KEY', 'mock-key');
