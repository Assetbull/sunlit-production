/**
 * Leapter MCP Client — External Backend Integration Layer
 *
 * Communicates with the Sunlit Energy backend MCP hosted on Leapter.
 * Provides typed wrappers around the available MCP tools:
 *   - create_rfq: Creates a new Request for Quotation
 *   - sanitize_string: Scrubs string inputs for XSS/injection protection
 *
 * GEMINI.md §8: Use ONLY defined endpoints.
 * GEMINI.md §4: ALL INPUTS MUST be sanitized.
 *
 * All calls use JSON-RPC 2.0 protocol over HTTPS with API key auth.
 */

const LEAPTER_MCP_URL = process.env.LEAPTER_MCP_URL
    || 'https://lab.leapter.com/runtime/api/v1/6d7474ab-4b53-4fc6-a27d-a18d035c61cb/6df7fd72-fc00-46e5-b641-5a91b002ea54/mcp';

const LEAPTER_API_KEY = process.env.LEAPTER_API_KEY
    || 'lpt_VKNfyCHWgQNpocXSuAIrKioXAzmB3whngBVG1joGI';

// ======================================================================
// Types
// ======================================================================

export type ProjectType = 'Residential' | 'Commercial';
export type ConfigMode = 'System' | 'Appliance';

export interface RfqApplianceItem {
    name: string;
    quantity: number;
    wattage?: number;
}

export interface RfqSystemComponent {
    type: string;       // e.g. 'inverter', 'battery', 'solar_panel'
    brand?: string;
    size?: string;      // e.g. '15KVA', '30KWh'
    wattage?: number;
    quantity?: number;
}

export interface CreateRfqInput {
    projectType: ProjectType;
    configMode: ConfigMode;
    location?: string;
    budget: number;
    timeline?: string;
    components?: RfqSystemComponent[];
    appliances?: RfqApplianceItem[];
}

export interface McpToolCallResult {
    success: boolean;
    data?: unknown;
    error?: string;
}

// ======================================================================
// JSON-RPC 2.0 Transport
// ======================================================================

let rpcRequestId = 0;

async function callMcpTool(
    toolName: string,
    args: Record<string, unknown>
): Promise<McpToolCallResult> {
    rpcRequestId++;

    const body = {
        jsonrpc: '2.0',
        id: rpcRequestId,
        method: 'tools/call',
        params: {
            name: toolName,
            arguments: args,
        },
    };

    try {
        const response = await fetch(LEAPTER_MCP_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': LEAPTER_API_KEY,
            },
            body: JSON.stringify(body),
            signal: AbortSignal.timeout(30_000), // 30s timeout
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[MCP] HTTP ${response.status}: ${errorText}`);
            return {
                success: false,
                error: `MCP backend returned HTTP ${response.status}`,
            };
        }

        const json = await response.json();

        // JSON-RPC error check
        if (json.error) {
            console.error('[MCP] JSON-RPC error:', json.error);
            return {
                success: false,
                error: json.error.message || 'MCP tool call failed',
            };
        }

        return {
            success: true,
            data: json.result,
        };
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown MCP error';
        console.error('[MCP] Transport error:', message);
        return {
            success: false,
            error: message,
        };
    }
}

// ======================================================================
// Typed Tool Wrappers
// ======================================================================

/**
 * Creates an RFQ via the Leapter MCP backend.
 *
 * Maps the Project Owner's multi-step wizard data to the remote
 * `create_rfq` tool's input schema.
 */
export async function createRfqViaMcp(input: CreateRfqInput): Promise<McpToolCallResult> {
    return callMcpTool('create_rfq', {
        projectType: input.projectType,
        configMode: input.configMode,
        location: input.location ?? null,
        budget: input.budget,
        timeline: input.timeline ?? null,
        components: input.components ?? null,
        appliances: input.appliances ?? null,
    });
}

/**
 * Sanitizes a string value using the Leapter MCP's `sanitize_string` tool.
 *
 * Provides server-side, defense-in-depth string scrubbing in addition
 * to the local `sanitizeInput` function in `@/shared/validators/sanitize.ts`.
 */
export async function sanitizeStringViaMcp(value: string): Promise<string> {
    const result = await callMcpTool('sanitize_string', { value });

    if (!result.success || !result.data) {
        // Fallback: return the HTML-entity-encoded version locally
        console.warn('[MCP] sanitize_string failed, using local fallback');
        return value.replace(/[&<>"'`/]/g, (c) => {
            const map: Record<string, string> = {
                '&': '&amp;', '<': '&lt;', '>': '&gt;',
                '"': '&quot;', "'": '&#x27;', '/': '&#x2F;', '`': '&#96;',
            };
            return map[c] || c;
        });
    }

    // Extract sanitized value from MCP response
    const resultData = result.data as { content?: Array<{ text?: string }> };
    if (resultData.content?.[0]?.text) {
        return resultData.content[0].text;
    }

    return value;
}
