# Final Written Questions

## 1. What adjudication rules (technical + medical) did you extract from the documents?

Technical rules: Service code validation, approval number format validation, mandatory field checks, threshold validation for paid amounts (>10,000 AED requires approval), service date validation, and facility ID constraints.

Medical rules: Diagnosis code & service code compatibility checks, encounter type constraints for specific services, and validity of diagnosis codes against standard medical coding systems.

## 2. What are your top five assumptions in implementing this case study?

1. Single-user authentication is sufficient for demo purposes
2. SQLite database is acceptable for prototyping (can be replaced with PostgreSQL)
3. File format standardization (Excel) for claims data input
4. LLM validation can supplement static rules but requires human review
5. Error categorization into Technical/Medical is sufficient (no subcategories needed)

## 3. What top five questions would you ask the system architect to improve your submission?

1. What specific metrics are most important for stakeholders to visualize?
2. Are there additional rule categories beyond Technical/Medical to consider?
3. What volume of claims should the system handle in production?
4. How frequently will rule documents be updated?
5. What integration points with other systems should be prioritized?