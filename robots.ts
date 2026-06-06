// src/app/robots.ts
import { MetadataRoute } from "next";

const BASE_URL = "https://diario-revista-castellanica.vercel.app";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
        {
            userAgent: "*",
            allow: "/",
            disallow: ["/admin", "/admin/"],
        },
        ],
        sitemap: `${BASE_URL}/sitemap.xml`,
        host: BASE_URL,
    };
    }