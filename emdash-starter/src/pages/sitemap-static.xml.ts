import type { APIRoute } from "astro";

// Halaman tetap yang tidak masuk sitemap bawaan EmDash (yang hanya berisi artikel).
// Halaman login dan dashboard sengaja tidak dicantumkan.
const site = "https://arenkalogistics.com";
const paths = ["/", "/posts", "/kalkulator-cbm", "/privasi", "/ketentuan"];

export const GET: APIRoute = () => new Response(
	`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths
		.map((path) => `  <url><loc>${site}${path}</loc></url>`)
		.join("\n")}\n</urlset>\n`,
	{ headers: { "Content-Type": "application/xml; charset=utf-8" } },
);
