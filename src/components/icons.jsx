// Minimal inline icon set. Kept as plain SVG (no icon-library dependency) -
// consistent 1.75 stroke weight throughout, per the no-emoji / clean-vector
// icon rule. Add more here as needed rather than reaching for a new package.

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

export function IconUpload({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <path d="M12 16V4m0 0 4 4m-4-4-4 4" />
      <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
    </svg>
  );
}

export function IconSparkle({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6" />
    </svg>
  );
}

export function IconSearch({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m20 20-4.3-4.3" />
    </svg>
  );
}

export function IconPlay({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <path d="M7 4.5v15l13-7.5-13-7.5Z" />
    </svg>
  );
}

export function IconPause({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <path d="M8 5v14M16 5v14" />
    </svg>
  );
}

export function IconDownload({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <path d="M12 4v12m0 0 4-4m-4 4-4-4" />
      <path d="M4 18v1a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1" />
    </svg>
  );
}

export function IconSettings({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M19.4 13.5a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.55V19.5a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.55 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.55-1H4.5a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.55-1.1 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34H10a1.7 1.7 0 0 0 1-1.55V4.5a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87V10a1.7 1.7 0 0 0 1.55 1h.1a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.55 1Z" />
    </svg>
  );
}

export function IconCheck({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <path d="m5 13 4 4L19 7" />
    </svg>
  );
}

export function IconClose({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function IconImage({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" />
      <circle cx="8.5" cy="9.5" r="1.5" />
      <path d="m5 17 4.5-5 3 3 2.5-3 4 5" />
    </svg>
  );
}

export function IconTag({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <path d="M11.5 4H6a2 2 0 0 0-2 2v5.5a2 2 0 0 0 .6 1.4l8.5 8.5a2 2 0 0 0 2.8 0l5.5-5.5a2 2 0 0 0 0-2.8l-8.5-8.5a2 2 0 0 0-1.4-.6Z" />
      <circle cx="8" cy="8" r="1.3" />
    </svg>
  );
}

export function IconFilm({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <rect x="3.5" y="4.5" width="17" height="15" rx="2" />
      <path d="M8 4.5v15M16 4.5v15M3.5 9h4.5M3.5 15h4.5M16 9h4.5M16 15h4.5" />
    </svg>
  );
}
