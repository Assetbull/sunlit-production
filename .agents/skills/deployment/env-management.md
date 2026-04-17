# SKILL: Environment & Secret Management

## PURPOSE
To securely manage configuration and secrets across development, staging, and production environments.

## WHEN TO USE
- Provisioning new infrastructure services
- Updating API keys (Paystack, Clerk, Sanity)
- Handling developer onboarding/offboarding

## INPUT
- Secret Key / Environment Variable
- Target Environment (Dev, Staging, Prod)

## OUTPUT
- Encrypted and injected configuration

## EXECUTION STEPS
1. **Use Strict Naming**: Standardize on prefixing (e.g., `NEXT_PUBLIC_` for frontend-exposed, raw prefix for backend only).
2. **Externalize Secrets**: Never store keys in `.env.local` inside the repo. Use GitHub Secrets or Vault.
3. **Audit Access**: Regularly rotate sensitive keys (Paystack, Clerk) as defined in the security policy.
4. **Validate on Proxy**: Ensure all secrets are correctly loaded into the DataService during initialization.
5. **Fail on Missing**: Block server startup if mandatory environment variables are undefined.

## VALIDATION RULES
- Zero hardcoded secrets in the codebase (monitored via pre-commit hooks).

## FAILURE CONDITIONS
- Leaked production secrets through misconfigured `.env` files.
- Unauthorized access to staging environments with production data.

## DEPENDENCIES
- `.agents/skills/security/webhook-verification.md`
