import { test, describe } from 'node:test';
import assert from 'node:assert';
import { LEGAL_DOCUMENTS } from '../../lib/legal/legal-registry';

describe('Sunlit Legal & Compliance Engine Suite', () => {
  describe('Document Registry & Metadata Governance', () => {
    const requiredSlugs = [
      'privacy',
      'terms',
      'cookies',
      'marketplace-terms',
      'escrow-terms',
      'refunds',
      'security-disclosure',
      'intellectual-property',
      'community-guidelines',
      'compliance',
      'contact',
    ];

    test('All required legal policies are registered and published', () => {
      for (const slug of requiredSlugs) {
        const doc = LEGAL_DOCUMENTS[slug];
        assert.ok(doc, `Document with slug '${slug}' must exist in registry`);
        assert.strictEqual(doc.status, 'PUBLISHED', `Document '${slug}' must have status PUBLISHED`);
        assert.ok(doc.version.length > 0, `Document '${slug}' must have a valid version`);
        assert.ok(doc.sections.length > 0, `Document '${slug}' must contain structured sections`);
        assert.ok(doc.summary.length > 0, `Document '${slug}' must contain an executive summary`);
        assert.ok(doc.jurisdiction.includes('Nigeria'), `Document '${slug}' must specify Nigerian jurisdiction`);
      }
    });

    test('Every document section has unique ID, number, and readable content', () => {
      for (const [slug, doc] of Object.entries(LEGAL_DOCUMENTS)) {
        const seenIds = new Set<string>();
        for (const section of doc.sections) {
          assert.ok(section.id, `Section in '${slug}' must have an ID`);
          assert.ok(!seenIds.has(section.id), `Duplicate section ID '${section.id}' in '${slug}'`);
          seenIds.add(section.id);
          assert.ok(section.title.length > 0, `Section in '${slug}' must have a title`);
          assert.ok(section.content.length > 0, `Section '${section.id}' in '${slug}' must have paragraphs`);
        }
      }
    });
  });

  describe('Privacy Policy (NDPA 2023 Compliance)', () => {
    test('Privacy policy defines mandatory NDPA data subject rights and DPO contact', () => {
      const privacy = LEGAL_DOCUMENTS.privacy;
      assert.strictEqual(privacy.governingLaw, 'Nigeria Data Protection Act (NDPA) 2023');

      const sectionIds = privacy.sections.map((s) => s.id);
      assert.ok(sectionIds.includes('collect'), 'Must define data collection');
      assert.ok(sectionIds.includes('use'), 'Must define data usage');
      assert.ok(sectionIds.includes('share'), 'Must define third-party sharing');
      assert.ok(sectionIds.includes('rights'), 'Must define NDPA data subject rights');
      assert.ok(sectionIds.includes('security'), 'Must define security and retention');
      assert.ok(sectionIds.includes('contact'), 'Must define DPO contact');

      const contactSection = privacy.sections.find((s) => s.id === 'contact');
      assert.ok(
        contactSection?.content.some((p) => p.includes('privacy@sunlit.energy') || p.includes('dpo@sunlit.energy')),
        'Must include official DPO email address'
      );
    });
  });

  describe('Milestone Escrow & Marketplace Protection', () => {
    test('Escrow terms mandate segregated accounts and customer milestone OTP sign-off', () => {
      const escrow = LEGAL_DOCUMENTS['escrow-terms'];
      assert.ok(escrow, 'Escrow terms must exist');

      const custodySection = escrow.sections.find((s) => s.id === 'custody');
      assert.ok(
        custodySection?.content.some((p) => p.toLowerCase().includes('segregated')),
        'Must specify segregated escrow accounts'
      );

      const milestoneSection = escrow.sections.find((s) => s.id === 'milestones');
      assert.ok(
        milestoneSection?.content.some((p) => p.includes('OTP')),
        'Must specify OTP-based authorization for milestone releases'
      );
    });

    test('Marketplace terms enforce minimum 12-month workmanship warranty', () => {
      const mkt = LEGAL_DOCUMENTS['marketplace-terms'];
      const warrantySection = mkt.sections.find((s) => s.id === 'warranties');
      assert.ok(
        warrantySection?.content.some((p) => p.includes('12-month')),
        'Must mandate minimum 12-month installer workmanship warranty'
      );
    });
  });
});
