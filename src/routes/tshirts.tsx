import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/category-page";

export const Route = createFileRoute("/tshirts")({
  head: () => ({
    meta: [
      { title: "T-Shirts — CodeWithHarry Merch" },
      {
        name: "description",
        content: "Developer-humour t-shirts in soft combed cotton. Sizes S to XXL.",
      },
      { property: "og:title", content: "T-Shirts — CodeWithHarry Merch" },
      {
        property: "og:description",
        content: "Developer-humour t-shirts in soft combed cotton. Sizes S to XXL.",
      },
    ],
  }),
  component: () => (
    <CategoryPage
      category="tshirts"
      blurb="Soft combed-cotton tees with prints that survive the wash cycle and the code review."
    />
  ),
});
