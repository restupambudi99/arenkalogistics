import { defineMiddleware } from "astro:middleware";
import { env } from "cloudflare:workers";

export const onRequest = defineMiddleware(async (context, next) => {
	const response = await next();
	if (env.INDEXING_ENABLED === "true") return response;

	const headers = new Headers(response.headers);
	headers.set("X-Robots-Tag", "noindex");
	return new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers,
	});
});
