import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/category-page";

export const Route = createFileRoute("/hoodies")({
  head: () => ({
    meta: [
      { title: "Hoodies — CodeWithHarry Merch" },
      {
        name: "description",
        content: "Heavyweight 380 GSM fleece hoodies built for late-night coding sessions.",
      },
      { property: "og:title", content: "Hoodies — CodeWithHarry Merch" },
      {
        property: "og:description",
        content: "Heavyweight 380 GSM fleece hoodies built for late-night coding sessions.",
      },
    ],
  }),
  component: () => (
    <CategoryPage
      category="hoodies"
      blurb="Heavyweight fleece, brushed inside, roomy kangaroo pocket. Built for 2 AM debugging."
    />
  ),
});
