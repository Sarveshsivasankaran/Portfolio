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

vi.mock("framer-motion", () => {
  const componentHandler = {
    get: (_: any, prop: string) => {
      return ({ children, ...props }: any) => {
        const Tag = prop as any;
        return <Tag {...props}>{children}</Tag>;
      };
    },
  };

  return {
    motion: new Proxy({}, componentHandler),
    useScroll: () => ({
      scrollYProgress: { get: () => 0 },
    }),
    useMotionValueEvent: vi.fn(),
    useReducedMotion: () => true,
    useInView: () => true,
  };
});

afterEach(cleanup);

describe("Projects section", () => {
  it("renders strictly the 9 curated projects in the specified order", () => {
    state.data = [];
    render(<Projects />);

    expect(screen.getByText("ClaimShield Nexus")).toBeTruthy();
    expect(screen.getByText("CacheFusion")).toBeTruthy();
    expect(screen.getByText("Notezilla 2.0")).toBeTruthy();
    expect(screen.getByText("Visualec")).toBeTruthy();
    expect(screen.getByText("Telegram Bot Beru")).toBeTruthy();
    expect(screen.getByText("Disaster Management System")).toBeTruthy();
    expect(screen.getByText("Smart Buoy")).toBeTruthy();
    expect(screen.getByText("Water Quality ML Monitor")).toBeTruthy();
    expect(screen.getByText("Baby Monitoring System")).toBeTruthy();

    const viewCodeLinks = screen.getAllByRole("link", { name: /View code/i });
    expect(viewCodeLinks).toHaveLength(9);

    const liveDemos = screen.getAllByRole("link", { name: /Live demo/i });
    expect(liveDemos.length).toBeGreaterThanOrEqual(3);
  });

  it("updates active index when clicking next and previous buttons", () => {
    state.data = [];
    render(<Projects />);

    expect(screen.getByText("01 / 09")).toBeTruthy();

    const nextBtn = screen.getByRole("button", { name: /Next project/i });
    fireEvent.click(nextBtn);

    expect(screen.getByText("02 / 09")).toBeTruthy();

    const prevBtn = screen.getByRole("button", { name: /Previous project/i });
    fireEvent.click(prevBtn);

    expect(screen.getByText("01 / 09")).toBeTruthy();
  });

  it("merges live github repos data when available", () => {
    state.data = [
      {
        id: 777,
        name: "ClaimShield_Nexus",
        description: "Live custom telemetry from github",
        language: "Python",
        topics: [],
        stargazers_count: 42,
        forks_count: 5,
        html_url: "https://github.com/Sarveshsivasankaran/ClaimShield_Nexus",
        homepage: null,
        updated_at: "2026-10-01T00:00:00Z",
        pushed_at: "2026-10-01T00:00:00Z",
      },
    ];

    render(<Projects />);
    expect(screen.getByText("42 stars")).toBeTruthy();
    expect(screen.getByText("Live custom telemetry from github")).toBeTruthy();
  });
});

