# SKILL: Performance & SLA Enforcement

## PURPOSE
To guarantee a "world-class" user experience by meeting strict latency and load-time targets.

## WHEN TO USE
- Benchmarking UI pages
- Optimizing database queries
- Configuring caching strategies

## INPUT
- Current Performance Metrics (TTFB, LCP, Interaction Delay)
- Performance SLA: < 2s load, < 100ms interaction

## OUTPUT
- Optimized Build or Performance Report

## EXECUTION STEPS
1. **Enable Image Optimization**: Use Next.js `<Image />` with WebP and appropriate sizing.
2. **Implement Caching Layer**: Use Redis for frequently accessed data and Next.js ISR for content pages.
3. **Lazy Load Components**: Defer loading of non-critical UI elements (e.g., maps, heavy charts) until required.
4. **Minify & Compress**: Ensure Gzip/Brotli compression is active for all outbound assets.
5. **Monitor Web Vitals**: Regularly track LCP, FID, and CLS using automated build-time scripts.

## VALIDATION RULES
- Page load times MUST remain under 2 seconds on throttled 4G connections.
- Interaction latency for buttons and forms MUST remain under 100ms.

## FAILURE CONDITIONS
- Layout shifts (CLS > 0.1) caused by unoptimized assets.
- Unnecessary re-renders in the React tree dragging down interaction speed.

## DEPENDENCIES
- `.agents/skills/ui-ux/loading-states.md`
- `.agents/skills/database/query-validation.md`
