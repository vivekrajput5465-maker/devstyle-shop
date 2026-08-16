import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/category-page";

export const Route = createFileRoute("/mugs")({
  head: () => ({
    meta: [
      { title: "Mugs — CodeWithHarry Merch" },
      {
        name: "description",
        content: "Matte ceramic coffee mugs for developers. Microwave and dishwasher safe.",
      },
      { property: "og:title", content: "Mugs — CodeWithHarry Merch" },
      {
        property: "og:description",
        content: "Matte ceramic coffee mugs for developers. Microwave and dishwasher safe.",
      },
    ],
  }),
  component: () => (
    <CategoryPage
      category="mugs"
      blurb="Matte ceramic, 330ml and 450ml. Fuel delivery system for your next feature."
    />
  ),
});
