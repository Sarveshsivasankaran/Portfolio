import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import Projects from "../src/components/Projects";
import type { GitHubRepo } from "../src/hooks/useGitHubRepos";

const state = vi.hoisted(() => ({
  data: [] as GitHubRepo[],
  isLoading: false,
  isError: false,
  refetch: vi.fn(),
}));
vi.mock("../src/hooks/useGitHubRepos", () => ({ useGitHubRepos: () => state }));
vi.mock("framer-motion", () => ({
  useReducedMotion: () => true,
  useInView: () => true,
}));
afterEach(cleanup);
const repos = Array.from({ length: 20 }, (_, index) => ({
  id: index,
  name: `Project-${index + 1}`,
  description: `Build ${index + 1}`,
  language: index % 2 ? "Python" : "TypeScript",
  topics: [],
  stargazers_count: index,
  forks_count: 0,
  html_url: `https://github.com/example/project-${index}`,
  homepage: index === 0 ? "javascript:alert(1)" : null,
  updated_at: `2026-09-${String(28 - index).padStart(2, "0")}T00:00:00Z`,
  pushed_at: "2026-09-01T00:00:00Z",
})) satisfies GitHubRepo[];

describe("Project universe", () => {
  it("makes every repository reachable across scene groups and in the complete list", () => {
    state.data = repos;
    render(<Projects />);
    expect(
      screen.getAllByRole("button", { name: /^Explore Project/ }),
    ).toHaveLength(18);
    fireEvent.click(screen.getByRole("button", { name: "Next project group" }));
    expect(
      screen.getAllByRole("button", { name: /^Explore Project/ }),
    ).toHaveLength(2);
    expect(screen.getByRole("heading", { name: "Project 19" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Project list view" }));
    expect(screen.getAllByRole("link", { name: "View code" })).toHaveLength(20);
    expect(screen.queryByRole("link", { name: "Live demo" })).toBeNull();
  });
  it("filters and searches without leaving the user on an empty later page", () => {
    state.data = repos;
    render(<Projects />);
    fireEvent.click(screen.getByRole("button", { name: "Next project group" }));
    fireEvent.change(
      screen.getByRole("combobox", { name: "Filter by language" }),
      { target: { value: "Python" } },
    );
    expect(
      screen.getAllByRole("button", { name: /^Explore Project/ }),
    ).toHaveLength(10);
    fireEvent.change(
      screen.getByRole("searchbox", { name: "Search projects" }),
      { target: { value: "Project-20" } },
    );
    expect(
      screen.getAllByRole("button", { name: /^Explore Project/ }),
    ).toHaveLength(1);
    expect(screen.getByRole("heading", { name: "Project 20" })).toBeTruthy();
    fireEvent.change(screen.getByRole("searchbox"), {
      target: { value: "missing-project" },
    });
    expect(screen.getByText("No projects match your search.")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Clear filters" }));
    expect(
      screen.getAllByRole("button", { name: /^Explore Project/ }),
    ).toHaveLength(18);
  });
  it("supports keyboard selection, sorting, and safe external links with reduced motion", () => {
    state.data = repos;
    const { container } = render(<Projects />);
    const first = screen.getByRole("button", { name: "Explore Project 1" });
    fireEvent.keyDown(first, { key: "ArrowRight" });
    expect(document.activeElement).toBe(
      screen.getByRole("button", { name: "Explore Project 2" }),
    );
    expect(screen.getByRole("heading", { name: "Project 2" })).toBeTruthy();
    fireEvent.change(screen.getByRole("combobox", { name: "Sort projects" }), {
      target: { value: "stars" },
    });
    expect(screen.getByRole("heading", { name: "Project 20" })).toBeTruthy();
    expect(container.querySelector("section")?.dataset.moving).toBe("false");
  });
});
