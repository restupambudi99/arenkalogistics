import handler, { createScheduledHandler, PluginBridge } from "@emdash-cms/cloudflare/worker";

export { PluginBridge };

export default {
	...handler,
	async fetch(request: Request, env: Env, ctx: ExecutionContext) {
		const url = new URL(request.url);
		if (url.hostname === "www.arenkalogistics.com") {
			url.hostname = "arenkalogistics.com";
			return Response.redirect(url.toString(), 301);
		}
		return handler.fetch(request, env, ctx);
	},
	scheduled: createScheduledHandler(),
} satisfies ExportedHandler;
