import { component$, Slot } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { LayoutContent } from "../components/layout/LayoutContent";

export default component$(() => {
  return (
    <LayoutContent>
      <Slot />
    </LayoutContent>
  );
});

export const head: DocumentHead = {
  title: "Ministry Of Education",
  meta: [
    {
      name: "description",
      content: "Ministry Of Education - Your Study Companion for digital learning and growth.",
    },
  ],
};

