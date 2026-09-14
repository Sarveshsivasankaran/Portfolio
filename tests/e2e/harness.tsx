import React from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Wins from "../../src/components/Wins";
import Projects from "../../src/components/Projects";
import Skills from "../../src/components/Skills";
import "../../src/index.css";
const client = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});
createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={client}>
    {new URLSearchParams(location.search).get("view") === "projects" ? (
      <Projects />
    ) : new URLSearchParams(location.search).get("view") === "skills" ? (
      <Skills />
    ) : (
      <Wins />
    )}
  </QueryClientProvider>,
);
