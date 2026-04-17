# SKILL: Sanity Real-time Preview Mode

## PURPOSE
To provide content editors with an instant, live preview of how their changes will look on the production-grade frontend.

## WHEN TO USE
- Configuring the Sanity studio for stakeholders
- Testing new content layouts
- Verifying draft content before publishing

## INPUT
- Draft content updates
- User authentication status (for editors)

## OUTPUT
- Live preview UI in Next.js

## EXECUTION STEPS
1. **Toggle Preview Mode**: Use Next.js `previewData` or a dedicated URL param to switch the fetching logic to use the `preview` token.
2. **Listen for Updates**: Bind the frontend to Sanity's live visual-editing mode or listener API.
3. **Handle Draft Fragments**: Ensure draft versions are rendered instead of published ones during preview sessions.
4. **Implement Preview Banner**: Show a clear visual indicator on the UI when "Preview Mode" is active to prevent confusion.
5. **Secure the Bridge**: Restrict preview access to authenticated Sanity editors only.

## VALIDATION RULES
- Preview mode must NEVER be accidentally exposed to public project visitors.

## FAILURE CONDITIONS
- Preview mode leaking draft content to the public production URL.
- Broken preview visuals due to missing CSS tokens.

## DEPENDENCIES
- `.agents/skills/integration/sanity-schema.md`
