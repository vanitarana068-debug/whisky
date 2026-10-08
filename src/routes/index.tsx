import { createFileRoute } from "@tanstack/react-router";
import { Campaign } from "@/components/campaign/Campaign";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NOIRÉA — Crafted Beyond Time" },
      { name: "description", content: "Discover NOIRÉA, a fictional expression of time, craftsmanship and uncompromising character. An original cinematic whisky experience." },
      { property: "og:title", content: "NOIRÉA — Crafted Beyond Time" },
      { property: "og:description", content: "A fictional whisky house. An expression of patience, precision and uncompromising craft." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Campaign,
});
