/**
 * Pushes all tracked git files to GitHub using the Git Data API (tree + commit).
 * This is equivalent to `git push` but works without SSH/HTTPS credentials.
 * Uses the GITHUB_TOKEN env var for authentication.
 */

import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { resolve, join } from 'path';

const OWNER = 'Assetbull';
const REPO = 'sunlit-energy-marketplace';
const BRANCH = 'dev';
const TOKEN = process.env.GITHUB_TOKEN;

if (!TOKEN) {
    console.error('GITHUB_TOKEN env var is required');
    process.exit(1);
}

const API = `https://api.github.com/repos/${OWNER}/${REPO}`;

async function ghApi(path, options = {}) {
    const url = path.startsWith('http') ? path : `${API}${path}`;
    const res = await fetch(url, {
        ...options,
        headers: {
            'Accept': 'application/vnd.github+json',
            'Authorization': `Bearer ${TOKEN}`,
            'X-GitHub-Api-Version': '2022-11-28',
            ...options.headers,
        },
    });
    if (!res.ok) {
        const err = await res.text();
        throw new Error(`GitHub API ${res.status}: ${err}`);
    }
    return res.json();
}

async function main() {
    const rootDir = resolve(process.cwd(), '..');

    // Get all tracked files
    const files = execSync('git ls-tree -r --name-only dev', { cwd: rootDir, encoding: 'utf8' })
        .split('\n')
        .filter(f => f.trim() && f !== 'tmp-skill-clone' && f !== 'npx');

    console.log(`Found ${files.length} files to push`);

    // Get current branch ref
    let parentSha;
    try {
        const ref = await ghApi(`/git/refs/heads/${BRANCH}`);
        parentSha = ref.object.sha;
    } catch {
        parentSha = null;
    }

    // Create blobs for all files
    const treeItems = [];
    for (const filePath of files) {
        const fullPath = join(rootDir, filePath);
        let content;
        let encoding = 'utf-8';

        try {
            // Check if file is binary
            const isBinary = filePath.endsWith('.ico') || filePath.endsWith('.svg') || filePath.endsWith('.png');
            if (isBinary) {
                content = readFileSync(fullPath).toString('base64');
                encoding = 'base64';
            } else {
                content = readFileSync(fullPath, 'utf-8');
            }
        } catch (e) {
            console.warn(`Skipping ${filePath}: ${e.message}`);
            continue;
        }

        console.log(`Creating blob for: ${filePath}`);
        const blob = await ghApi('/git/blobs', {
            method: 'POST',
            body: JSON.stringify({ content, encoding }),
        });

        treeItems.push({
            path: filePath,
            mode: '100644',
            type: 'blob',
            sha: blob.sha,
        });
    }

    console.log(`Created ${treeItems.length} blobs. Creating tree...`);

    // Create tree
    const tree = await ghApi('/git/trees', {
        method: 'POST',
        body: JSON.stringify({ tree: treeItems }),
    });

    console.log(`Tree created: ${tree.sha}. Creating commit...`);

    // Create commit
    const commitBody = {
        message: 'feat: Sunlit Energy Marketplace — Project Owner Dashboard with 6 critical fixes\n\n- Full backend API layer (RFQ, Bids, Escrow, Payments, Disputes)\n- Zero-trust file upload pipeline\n- RBAC engine with Supabase + Clerk integration\n- Deterministic escrow state machine\n- Event-driven architecture with audit logging\n- Project Owner Dashboard UI (Next.js + TypeScript)',
        tree: tree.sha,
        parents: parentSha ? [parentSha] : [],
    };

    const commit = await ghApi('/git/commits', {
        method: 'POST',
        body: JSON.stringify(commitBody),
    });

    console.log(`Commit created: ${commit.sha}. Updating ref...`);

    // Update branch ref
    await ghApi(`/git/refs/heads/${BRANCH}`, {
        method: 'PATCH',
        body: JSON.stringify({ sha: commit.sha, force: true }),
    });

    console.log(`✅ Successfully pushed ${treeItems.length} files to ${OWNER}/${REPO}@${BRANCH}`);
    console.log(`   View: https://github.com/${OWNER}/${REPO}/tree/${BRANCH}`);
}

main().catch(e => { console.error(e); process.exit(1); });
