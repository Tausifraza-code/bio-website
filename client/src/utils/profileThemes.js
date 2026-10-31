export const PROFILE_THEMES = {
  executive: {
    primary: "#1e3a8a",
    accent: "#7c3aed",
    background: "#0c1630",
    surface: "#152447",
    card: "#101c38",
    text: "#f8fafc",
    muted: "#a5b4cf",
    border: "#33466c",
  },
  emerald: {
    primary: "#10b981",
    accent: "#14b8a6",
    background: "#062c25",
    surface: "#104438",
    card: "#0c382f",
    text: "#ecfdf5",
    muted: "#a7cfc3",
    border: "#216653",
  },
  rose: {
    primary: "#f43f5e",
    accent: "#fb923c",
    background: "#321722",
    surface: "#49202f",
    card: "#24151d",
    text: "#fff1f2",
    muted: "#e7bdc8",
    border: "#71404e",
  },
  obsidian: {
    primary: "#334155",
    accent: "#94a3b8",
    background: "#09090b",
    surface: "#18181b",
    card: "#111114",
    text: "#f4f4f5",
    muted: "#a1a1aa",
    border: "#3f3f46",
  },
  sunset: {
    primary: "#f59e0b",
    accent: "#f97316",
    background: "#24130b",
    surface: "#3b2113",
    card: "#191513",
    text: "#fff7ed",
    muted: "#d6bba4",
    border: "#65452f",
  },
};

export const DEFAULT_THEME = "sunset";

export const getProfileTheme = (themeId) =>
  PROFILE_THEMES[themeId] || PROFILE_THEMES[DEFAULT_THEME];

export const getThemeVariables = (theme) => ({
  "--theme-bg": theme.background,
  "--theme-surface": theme.surface,
  "--theme-card": theme.card,
  "--theme-text": theme.text,
  "--theme-muted": theme.muted,
  "--theme-border": theme.border,
  "--theme-primary": theme.primary,
  "--theme-accent": theme.accent,
});
