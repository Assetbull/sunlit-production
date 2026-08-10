/**
 * Installer Slug Utilities
 * 
 * Generates and validates immutable installer slugs in the format:
 *   company-name-short-opaque-id
 *   e.g. "solarcraft-energy-a8f42c"
 * 
 * Design decisions:
 * - Slug is immutable once created — business name changes don't change the URL
 * - Short opaque ID is derived from UUID (first 6 hex chars) — not sequential
 * - URL-safe: lowercase, alphanumeric + hyphens only
 * - Collision-resistant: uniqueness constraint at DB level, retry on collision
 * - Internal DB IDs are never exposed
 */

import { randomUUID } from 'crypto';

/**
 * Generate a URL-safe slug from a business name + opaque short ID.
 * 
 * @param businessName - The human-readable business name
 * @returns A slug in format "company-name-a8f42c"
 */
export function generateInstallerSlug(businessName: string): string {
  const nameSlug = slugify(businessName);
  const opaqueId = generateOpaqueId();
  return `${nameSlug}-${opaqueId}`;
}

/**
 * Generate a short opaque identifier from a UUID.
 * Uses the first 6 hex characters — 16.7M possible values.
 * Collision-resistant enough for the slug; the DB uniqueness
 * constraint provides the hard guarantee.
 */
function generateOpaqueId(): string {
  const uuid = randomUUID();
  // Remove hyphens and take first 6 chars
  return uuid.replace(/-/g, '').substring(0, 6);
}

/**
 * Convert a business name to a URL-safe slug component.
 * 
 * Rules:
 * - Lowercase
 * - Replace whitespace and special chars with hyphens
 * - Remove consecutive hyphens
 * - Remove leading/trailing hyphens
 * - Max 50 chars for the name portion
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    // Replace common business suffixes
    .replace(/\b(limited|ltd|plc|inc|corp|llc|llp)\b/g, '')
    // Replace non-alphanumeric with hyphens
    .replace(/[^a-z0-9]+/g, '-')
    // Remove consecutive hyphens
    .replace(/-+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-|-$/g, '')
    // Limit length
    .substring(0, 50)
    // Clean trailing hyphen after substring
    .replace(/-$/, '');
}

/**
 * Generate a URL-safe slug for a public project.
 * Format: project-title-a8f42c
 */
export function generateProjectSlug(title: string): string {
  const nameSlug = slugify(title);
  const opaqueId = generateOpaqueId();
  return `${nameSlug}-${opaqueId}`;
}

/**
 * Extract the opaque ID portion from a slug.
 * Returns the last hyphen-separated segment.
 */
export function extractOpaqueId(slug: string): string {
  const parts = slug.split('-');
  return parts[parts.length - 1];
}

/**
 * Validate that a string is a valid installer slug format.
 */
export function isValidSlug(slug: string): boolean {
  // Must be lowercase alphanumeric with hyphens, ending in 6-char opaque ID
  return /^[a-z0-9][a-z0-9-]*-[a-f0-9]{6}$/.test(slug);
}

/**
 * Generate a location slug from state and city names.
 */
export function generateLocationSlug(name: string): string {
  return slugify(name);
}

export { slugify };
