# SKILL: Sanity Content Fetching (GROQ)

## PURPOSE
To retrieve content from the CMS efficiently, ensuring that the frontend is hydrated with relevant, optimized data.

## WHEN TO USE
- Hydrating landing pages or blog posts
- Resolving SEO metadata for page headers
- Fetching specific content fragments (e.g., promotional banners)

## INPUT
- Target content ID or type
- GROQ Query language

## OUTPUT
- Sanitized Content Object

## EXECUTION STEPS
1. **Compose GROQ Query**: Select only necessary fields to minimize payload size.
2. **Implement Reference Expansion**: Use `->` to resolve linked documents (e.g., Category names within a Blog Post).
3. **Use Sanity Client**: Execute fetches through a centralized wrapper that handles environment variables and API versions.
4. **Cache & Revalidation**: Implement Next.js ISR (Incremental Static Regeneration) with appropriate revalidation tags.
5. **Handle Missing Data**: Provide default/fallback content to prevent UI breakage on empty CMS responses.

## VALIDATION RULES
- No "catch-all" queries (`*[]`). Always filter by type and limit results.

## FAILURE CONDITIONS
- High-latency queries due to excessive field expansion.
- Hardcoded fetching logic outside of the core CMS service.

## DEPENDENCIES
- `.agents/skills/integration/sanity-preview.md`
