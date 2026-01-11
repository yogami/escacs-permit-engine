Feature: Permit Intelligence Engine
  As a compliance officer
  I want to upload stormwater permit PDFs
  So that I can extract inspection requirements using AI and query project obligations

  Scenario: Uploading and parsing a permit document
    Given a stormwater permit PDF named "state_permit.pdf"
    When I upload the "state_permit.pdf" to the intelligence engine
    Then the engine should extract the "inspection_frequency" requirement
    And the engine should identify the "rainfall_threshold" as "0.5"

  Scenario: Querying permit obligations via RAG
    Given a permit document has been indexed for site "site-123"
    When I query the engine with "What are the stabilization requirements for bare soil?"
    Then I should receive an answer with a confidence score greater than 0.8
    And the answer should reference the "Stabilization" section of the permit
