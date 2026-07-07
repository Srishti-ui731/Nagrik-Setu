# Security Policy

## Supported Versions

Only the current active production build is supported for security patches.

## Security Safeguards Implemented

The following security mitigations are implemented on the Nagrik Setu platform:

1. **Environment Segregation & Secrets Management**:
   - The server uses a `.env` file for credentials (such as the Gemini API Key).
   - This `.env` configuration is explicitly ignored in `.gitignore` and is never committed to source control.

2. **Input Validation and Sanitization**:
   - The complaint submission endpoint (`/api/complaints`) validates incoming fields (checking character length ranges, formatting regular expressions for emails, phone numbers, and pincodes) before committing data to memory.

3. **Rate Limiting & Abuse Prevention**:
   - Custom in-memory rate-limiting middleware restricts clients to a maximum of 30 requests per 10 minutes per IP address on all paid GenAI routes (`/api/chat`, `/api/simplify`, `/api/draft`, and `/api/tts`).

4. **Clickjacking, MIME Sniffing & XSS Mitigation**:
   - Configured custom security headers on every request:
     - `X-Frame-Options: DENY` (prevents clickjacking)
     - `X-Content-Type-Options: nosniff` (prevents MIME sniffing)
     - `X-XSS-Protection: 1; mode=block` (mitigates cross-site scripting)
     - `Referrer-Policy: strict-origin-when-cross-origin`

5. **Error Leakage Prevention**:
   - Catch-all exception blocks in Express route handlers return generic, sanitized error messages (e.g. `Error generating AI response. Please try again later.`) instead of forwarding raw stack traces or internal environment variables to clients.

## Reporting a Vulnerability

Please report any security issues or vulnerabilities by emailing [security@nagriksetu.gov.in](mailto:security@nagriksetu.gov.in) rather than opening a public issue.
