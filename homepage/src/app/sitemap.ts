import { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://jngsystem.com";
  const now = new Date();

  return [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${base}/service`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/target`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/equipment`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/process`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/law`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/faq`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
  ];
}
