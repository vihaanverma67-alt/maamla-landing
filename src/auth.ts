import { jwtVerify, createRemoteJWKSet } from 'jose';

/**
 * Reads the Cloudflare Access JWT from the request, verifies it against the
 * team's JWKS, and returns the verified email claim.
 *
 * Returns null (never throws) in two cases:
 *   - No token is present  → local `wrangler dev` keeps working normally.
 *   - Token is present but fails verification → logged and treated as absent.
 */
export async function getVerifiedUserEmail(
	request: Request,
	env: Env,
): Promise<string | null> {
	// 1. Locate the JWT — header first, then cookie fallback.
	let token: string | null = request.headers.get('Cf-Access-Jwt-Assertion');

	if (!token) {
		const cookieHeader = request.headers.get('Cookie');
		if (cookieHeader) {
			const match = cookieHeader.match(/(?:^|;\s*)CF_Authorization=([^;]+)/);
			if (match) token = match[1];
		}
	}

	if (!token) return null;

	// 2. Verify the JWT against the team's remote JWKS.
	try {
		const jwks = createRemoteJWKSet(
			new URL(`https://${env.ACCESS_TEAM_DOMAIN}/cdn-cgi/access/certs`),
		);

		const { payload } = await jwtVerify(token, jwks, {
			issuer:   `https://${env.ACCESS_TEAM_DOMAIN}`,
			audience: env.ACCESS_AUD,
		});

		const email = payload['email'];
		if (typeof email === 'string' && email.length > 0) return email;

		console.log('[auth] JWT verified but email claim missing or empty');
		return null;
	} catch (err) {
		console.log('[auth] JWT verification failed:', String(err));
		return null;
	}
}
