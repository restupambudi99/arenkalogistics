import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
	const response = await next();
	if (context.locals.runtime?.env?.INDEXING_ENABLED === "true") return response;

	const headers = new Headers(response.headers);
	headers.set("X-Robots-Tag", "noindex");
	return new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers,
	});
});
