/**
 * SEEDED TEST FIXTURE — INTENTIONALLY VULNERABLE SYNTHETIC PATTERNS
 * Used strictly to verify that Sunlit Security Scanner reliably detects true positives.
 * ALL SECRETS AND DATA ARE CLEARLY FAKE / SYNTHETIC.
 */

// 1. Synthetic Fake Secret
const FAKE_SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIn0.fake_test_key_0000000000000000';

// 2. Synthetic Insecure Cookie
function setFakeInsecureCookie(response: any) {
  response.cookies.set('sunlit_session', 'token123', {
    httpOnly: false,
    secure: false,
  });
}

// 3. Synthetic SQL Injection
async function runVulnerableQuery(db: any, userInput: string) {
  return await db.query(`SELECT * FROM users WHERE email = '${userInput}'`);
}

// 4. Synthetic Insecure dangerouslySetInnerHTML
function VulnerableWidget(props: { rawContent: string }) {
  // @ts-ignore
  return <div dangerouslySetInnerHTML={{ __html: props.rawContent }} />;
}

// 5. Synthetic Insecure PostMessage
function sendBroadcastMessage(data: any) {
  window.postMessage(data, '*');
}

// 6. Synthetic Predictable Token
function generateWeakToken() {
  const token = 'token_' + Math.random().toString(36);
  return token;
}
