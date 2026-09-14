import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import {
  FiArrowLeft,
  FiArrowRight,
  FiArrowUpRight,
  FiBox,
  FiCode,
  FiCpu,
  FiExternalLink,
  FiGithub,
  FiGitBranch,
  FiGrid,
  FiLayers,
  FiList,
  FiPause,
  FiPlay,
  FiSearch,
  FiStar,
} from "react-icons/fi";
import { useGitHubRepos, type GitHubRepo } from "../hooks/useGitHubRepos";
import "./Projects.css";

type Sort = "updated" | "stars";
const PAGE_SIZE = 18;
const accents = ["var(--gate)", "var(--monarch)", "var(--teal)"];
const symbols = [FiCode, FiLayers, FiCpu, FiBox, FiGitBranch];
const titleOf = (repo: GitHubRepo) => repo.name.replace(/[-_]+/g, " ");
const safeLink = (url: string | null) => {
  try {
    const parsed = new URL(url || "");
    return ["https:", "http:"].includes(parsed.protocol) ? parsed.href : null;
  } catch {
    return null;
  }
};

// Three curved tiers leave a clear foreground for the character.
function panelPosition(index: number): CSSProperties {
  const tier = index < 5 ? 0 : index < 12 ? 1 : 2;
  const xs =
    tier === 0
      ? [10, 30, 50, 70, 90]
      : tier === 1
        ? [6.7, 21, 35.5, 50, 64.5, 79, 93.3]
        : [8, 23, 37, 63, 77, 92];
  const x = xs[index - (tier === 0 ? 0 : tier === 1 ? 5 : 12)];
  const distance = Math.abs(x - 50) / 50;
  return {
    "--panel-x": `${x}%`,
    "--panel-y": `${(tier === 0 ? 4 : tier === 1 ? 36 : 66) + distance * (tier === 0 ? 3 : tier === 1 ? -2 : -4)}%`,
    "--panel-width": tier === 0 ? "19%" : tier === 1 ? "13.4%" : "13.6%",
    "--panel-turn": `${(50 - x) * 0.38}deg`,
    "--panel-tilt": `${(x - 50) * 0.055}deg`,
    "--panel-accent": accents[index % 3],
    "--panel-delay": `${index * -0.37}s`,
  } as CSSProperties;
}

function ProjectPanel({
  repo,
  index,
  active,
  onSelect,
  onKeyDown,
}: {
  repo: GitHubRepo;
  index: number;
  active: boolean;
  onSelect: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void;
}) {
  const Icon = symbols[index % symbols.length];
  return (
    <button
      type="button"
      className={`project-portal ${active ? "is-selected" : ""}`}
      style={panelPosition(index)}
      onClick={onSelect}
      onKeyDown={onKeyDown}
      aria-pressed={active}
      aria-label={`Explore ${titleOf(repo)}`}
    >
      <span className="portal-window">
        <span className="portal-lights" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span>{String(index + 1).padStart(2, "0")} / PROJECT</span>
        <FiArrowUpRight aria-hidden="true" />
      </span>
      <span className={`portal-art portal-art-${index % 5}`} aria-hidden="true">
        <span className="portal-orbit" />
        <Icon />
        <span className="portal-crosshair" />
      </span>
      <span className="portal-content">
        <span className="portal-language">{repo.language || "Repository"}</span>
        <span className="portal-title">{titleOf(repo)}</span>
        <span className="portal-bottom">
          EXPLORE BUILD <FiArrowUpRight aria-hidden="true" />
        </span>
      </span>
    </button>
  );
}

export default function Projects() {
  const { data: repos = [], isLoading, isError, refetch } = useGitHubRepos();
  const [sort, setSort] = useState<Sort>("updated");
  const [language, setLanguage] = useState("All");
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"scene" | "list">("scene");
  const [page, setPage] = useState(0);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const roomRef = useRef<HTMLDivElement>(null);
  const isVisible = useInView(sectionRef, { margin: "100px" });
  const moving = !paused && !reducedMotion && isVisible;
  const languages = useMemo(
    () => [
      "All",
      ...Array.from(
        new Set(
          repos
            .map((repo) => repo.language)
            .filter((value): value is string => !!value),
        ),
      ).sort(),
    ],
    [repos],
  );
  const filtered = useMemo(
    () =>
      repos
        .filter(
          (repo) =>
            (language === "All" || repo.language === language) &&
            `${repo.name} ${repo.description || ""} ${repo.topics.join(" ")}`
              .toLowerCase()
              .includes(search.trim().toLowerCase()),
        )
        .sort((a, b) =>
          sort === "stars"
            ? b.stargazers_count - a.stargazers_count ||
              a.name.localeCompare(b.name)
            : new Date(b.updated_at).getTime() -
                new Date(a.updated_at).getTime() ||
              a.name.localeCompare(b.name),
        ),
    [repos, language, search, sort],
  );
  const pageCount = Math.ceil(filtered.length / PAGE_SIZE);
  const currentPage = Math.min(page, Math.max(0, pageCount - 1));
  const visible = filtered.slice(
    currentPage * PAGE_SIZE,
    (currentPage + 1) * PAGE_SIZE,
  );
  const selected = visible.find((repo) => repo.id === selectedId) || visible[0];

  useEffect(() => {
    if (!roomRef.current || reducedMotion || !isVisible || view !== "scene")
      return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".project-portal",
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.65,
          stagger: 0.035,
          ease: "power2.out",
          clearProps: "opacity",
        },
      );
    }, roomRef);
    return () => ctx.revert();
  }, [
    currentPage,
    language,
    sort,
    search,
    isVisible,
    reducedMotion,
    view,
    isLoading,
  ]);

  function keyboardSelect(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? visible.length - 1
          : (index + (event.key === "ArrowRight" ? 1 : -1) + visible.length) %
            visible.length;
    setSelectedId(visible[next].id);
    roomRef.current
      ?.querySelectorAll<HTMLButtonElement>(".project-portal")
      [next]?.focus();
  }

  const changePage = (next: number) => {
    setPage(next);
    setSelectedId(null);
  };
  return (
    <section
      id="projects"
      ref={sectionRef}
      className="projects-dimension"
      data-moving={moving}
    >
      <div className="projects-heading-row">
        <div>
          <p className="section-label">// DUNGEON.RAIDS</p>
          <h2 className="section-heading">Projects</h2>
        </div>
        <p className="projects-live">
          <span aria-hidden="true" />{" "}
          {isLoading
            ? "CONNECTING TO GITHUB"
            : `${repos.length} BUILDS / LIVE FROM GITHUB`}
        </p>
      </div>
      <div className="projects-intro">
        <p>
          A world of ideas.
          <br />
          <span>Built into reality.</span>
        </p>
        <span>
          Step inside my project universe.
          <br />
          Choose a screen. Explore the build.
        </span>
      </div>

      <div className="projects-toolbar">
        <label className="projects-search">
          <FiSearch aria-hidden="true" />
          <span className="projects-sr-only">Search projects</span>
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              changePage(0);
            }}
            placeholder="Find a project…"
            type="search"
          />
        </label>
        <label className="projects-select">
          <span className="projects-sr-only">Filter by language</span>
          <select
            value={language}
            onChange={(e) => {
              setLanguage(e.target.value);
              changePage(0);
            }}
          >
            {languages.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label className="projects-select">
          <span className="projects-sr-only">Sort projects</span>
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value as Sort);
              changePage(0);
            }}
          >
            <option value="updated">Recently updated</option>
            <option value="stars">Most starred</option>
          </select>
        </label>
        <div className="projects-view-switch" aria-label="Project display">
          <button
            type="button"
            aria-label="Immersive project view"
            aria-pressed={view === "scene"}
            onClick={() => setView("scene")}
          >
            <FiGrid aria-hidden="true" />
            <span>Universe</span>
          </button>
          <button
            type="button"
            aria-label="Project list view"
            aria-pressed={view === "list"}
            onClick={() => setView("list")}
          >
            <FiList aria-hidden="true" />
            <span>List</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="projects-loading" role="status">
          <span className="projects-loading-ring" />
          <p>Opening the project universe…</p>
        </div>
      ) : isError ? (
        <div className="projects-empty" role="alert">
          <p>Projects couldn’t be loaded.</p>
          <button className="btn-ghost" onClick={() => refetch()}>
            Try again
          </button>
        </div>
      ) : !filtered.length ? (
        <div className="projects-empty">
          <p>No projects match your search.</p>
          <button
            className="btn-ghost"
            onClick={() => {
              setSearch("");
              setLanguage("All");
              changePage(0);
            }}
          >
            Clear filters
          </button>
        </div>
      ) : (
        <>
          {view === "scene" ? (
            <>
              <div
                className="project-room"
                ref={roomRef}
                aria-label="Interactive project universe"
              >
                <div className="room-atmosphere" aria-hidden="true">
                  <div className="room-halo halo-one" />
                  <div className="room-halo halo-two" />
                  <div className="room-halo halo-three" />
                  <div className="room-beam" />
                </div>
                <div className="room-caption" aria-hidden="true">
                  IDEAS
                  <br />
                  SYSTEMS
                  <br />
                  EXPERIENCES
                </div>
                <div className="project-wall">
                  {visible.map((repo, index) => (
                    <ProjectPanel
                      key={repo.id}
                      repo={repo}
                      index={index}
                      active={selected?.id === repo.id}
                      onSelect={() => setSelectedId(repo.id)}
                      onKeyDown={(event) => keyboardSelect(event, index)}
                    />
                  ))}
                </div>
                <div className="room-floor" aria-hidden="true">
                  <div className="room-grid" />
                  <div className="floor-ring ring-one" />
                  <div className="floor-ring ring-two" />
                  <div className="floor-ring ring-three" />
                </div>
                <div className="project-character">
                  <div className="character-aura" aria-hidden="true" />
                  <div className="character-figure">
                    <span className="character-shadow" aria-hidden="true" />
                    <img
                      src="/characters/sarvesh-projects.png"
                      alt="Illustrated Sarvesh in a black suit, standing with his back to the viewer and facing the project screens"
                      width="1024"
                      height="1536"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </div>
                <div className="room-signature" aria-hidden="true">
                  SARVESH SIVASANKARAN
                  <span>THE BUILDER / AT THE CENTER OF IT ALL</span>
                </div>
                <button
                  className="projects-motion"
                  type="button"
                  disabled={!!reducedMotion}
                  onClick={() => setPaused((value) => !value)}
                  aria-label={
                    paused || reducedMotion
                      ? "Resume scene animation"
                      : "Pause scene animation"
                  }
                >
                  {paused || reducedMotion ? (
                    <FiPlay aria-hidden="true" />
                  ) : (
                    <FiPause aria-hidden="true" />
                  )}
                  <span>
                    {reducedMotion
                      ? "Reduced motion"
                      : paused
                        ? "Motion paused"
                        : "Pause motion"}
                  </span>
                </button>
              </div>
              {selected && (
                <div
                  className="project-inspector"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  <div className="inspector-number" aria-hidden="true">
                    {String(
                      filtered.findIndex((repo) => repo.id === selected.id) + 1,
                    ).padStart(2, "0")}
                  </div>
                  <div className="inspector-copy">
                    <p className="section-label">
                      SELECTED BUILD / {selected.language || "REPOSITORY"}
                    </p>
                    <h3>{titleOf(selected)}</h3>
                    <p>
                      {selected.description ||
                        "Explore the source code, implementation, and latest development on GitHub."}
                    </p>
                    <div className="inspector-meta">
                      <span>
                        <FiStar aria-hidden="true" />{" "}
                        {selected.stargazers_count} stars
                      </span>
                      <span>
                        <FiGitBranch aria-hidden="true" />{" "}
                        {selected.forks_count} forks
                      </span>
                    </div>
                  </div>
                  <ProjectLinks repo={selected} />
                </div>
              )}
            </>
          ) : (
            <div className="projects-directory">
              {filtered.map((repo, index) => (
                <article key={repo.id} className="directory-project">
                  <span className="directory-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <span className="portal-language">
                      {repo.language || "Repository"}
                    </span>
                    <h3>{titleOf(repo)}</h3>
                    <p>
                      {repo.description || "Explore this repository on GitHub."}
                    </p>
                  </div>
                  <ProjectLinks repo={repo} />
                </article>
              ))}
            </div>
          )}
          <div className="projects-footer">
            <p role="status">
              {view === "scene"
                ? `${currentPage * PAGE_SIZE + 1}–${Math.min((currentPage + 1) * PAGE_SIZE, filtered.length)} of ${filtered.length} projects`
                : `${filtered.length} projects`}
              <span>
                {view === "scene"
                  ? "Select a panel to explore · Arrow keys to navigate"
                  : "Every build, in one place"}
              </span>
            </p>
            {view === "scene" && pageCount > 1 && (
              <div className="projects-pagination">
                <button
                  type="button"
                  aria-label="Previous project group"
                  disabled={currentPage === 0}
                  onClick={() => changePage(currentPage - 1)}
                >
                  <FiArrowLeft />
                </button>
                <span>
                  {currentPage + 1} / {pageCount}
                </span>
                <button
                  type="button"
                  aria-label="Next project group"
                  disabled={currentPage === pageCount - 1}
                  onClick={() => changePage(currentPage + 1)}
                >
                  <FiArrowRight />
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
}

function ProjectLinks({ repo }: { repo: GitHubRepo }) {
  const code = safeLink(repo.html_url);
  const demo = safeLink(repo.homepage);
  return (
    <div className="project-links">
      {code && (
        <a
          href={code}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ghost"
        >
          <FiGithub aria-hidden="true" /> View code
        </a>
      )}
      {demo && (
        <a
          href={demo}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
        >
          <FiExternalLink aria-hidden="true" /> Live demo
        </a>
      )}
    </div>
  );
}
