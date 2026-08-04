import { MetadataRoute } from "next";

// 1. Explicitly type what the API server object looks like
interface DisverzServer {
  id: string;
  createdAt: string | Date;
  lastChallengeAt?: string | Date | null;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://disverz.com";

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "always",
      priority: 1.0,
    },
  ];

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/servers?sort=active`,
    );
    const { data: servers } = await res.json();

    // 2. Used the explicit DisverzServer type instead of any
    const dynamicPages = servers.map((server: DisverzServer) => ({
      url: `${baseUrl}/servers/${server.id}`,
      lastModified: new Date(server.lastChallengeAt || server.createdAt),
      changeFrequency: "daily" as const,
      priority: 0.8,
    }));

    return [...staticPages, ...dynamicPages];
  } catch {
    // 3. Prefixed with underscore so ESLint knows it is intentionally unused
    return staticPages;
  }
}
