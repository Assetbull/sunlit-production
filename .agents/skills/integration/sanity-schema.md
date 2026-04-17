# SKILL: Sanity.io CMS Schema Definition

## PURPOSE
To ensure that all content for the marketplace (blogs, SEO, landing pages) is structured, typed, and easily editable.

## WHEN TO USE
- Adding new content types to the project
- Modifying SEO metadata structures
- Expanding the landing page dynamic builder

## INPUT
- Content requirements
- Sanity schema primitives (document, object, string, image)

## OUTPUT
- Validated Sanity Schema (JavaScript/TypeScript)

## EXECUTION STEPS
1. **Define Document Types**: Map core content categories: `blogPost`, `category`, `author`, `landingPage`, `siteSettings`.
2. **Implement SEO Object**: Create a reusable SEO object containing meta-title, meta-description, ogImage, and canonicalURL.
3. **Use Portable Text**: Standardize rich text fields using the Sanity `block` type for flexible rendering.
4. **Apply Validation Rules**: Use `Rule.required()` for critical fields to ensure content quality and SEO completeness.
5. **Support Internationalization**: (If applicable) implement field-level translation bridges.

## VALIDATION RULES
- 100% of landing page copy must be derived from Sanity; zero hardcoded content in the frontend.

## FAILURE CONDITIONS
- Publishing content that lacks mandatory SEO metadata.
- Using flat strings for rich text instead of the required Portable Text blocks.

## DEPENDENCIES
- `.agents/skills/integration/sanity-fetching.md`
