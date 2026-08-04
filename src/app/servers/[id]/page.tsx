// 📁 src/app/servers/[id]/page.tsx
import type { Metadata } from "next";
import ServerProfileClient from "./ServerProfileClient";

interface Props {
  params: Promise<{ id: string }>;
}

// 👑 1. THIS RUNS ON THE SERVER FOR DISCORD/TWITTER BOTS
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://disverz.com";

  try {
    const res = await fetch(`${baseUrl}/api/servers/${id}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) throw new Error();
    const server = await res.json();

    const title = `${server.name} — Join on Disverz`;
    const description = server.description
      ? `${server.memberCount || 0} Members • ${server.description.slice(0, 150)}...`
      : `Check out ${server.name} on Disverz — Real rankings based on human activity!`;

    const imageUrl = server.iconUrl || "https://disverz.com/og-default.png";

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `https://disverz.com/servers/${id}`,
        siteName: "Disverz",
        images: [
          {
            url: imageUrl,
            width: 500,
            height: 500,
            alt: `${server.name} Icon`,
          },
        ],
        type: "website",
      },
      twitter: {
        card: "summary",
        title,
        description,
        images: [imageUrl],
      },
    };
  } catch {
    return {
      title: "Disverz — Discover Discord Communities",
      description: "Real rankings based on real human activity.",
    };
  }
}

// 👑 2. THIS RENDERS THE UI FOR REAL HUMANS
export default function ServerPage() {
  return <ServerProfileClient />;
}
