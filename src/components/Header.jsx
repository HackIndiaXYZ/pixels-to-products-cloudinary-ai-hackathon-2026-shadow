import SettingsPanel from './SettingsPanel.jsx';

const TABS = [
  { id: 'studio', label: 'Studio' },
  { id: 'catalog', label: 'Catalog' },
  { id: 'reel', label: 'Reel maker' },
];

export default function Header({ tab, setTab, onConfigSaved }) {
  return (
    <header className="sticky top-0 z-20 border-b border-stone-200/80 bg-[#fafaf9]/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent font-display text-sm font-bold text-white">
            D
          </span>
          <span className="font-display text-lg font-semibold tracking-tight text-stone-900">
            Dukaan Studio
          </span>
        </div>

        <nav className="hidden gap-1 rounded-full border border-stone-200 bg-white p-1 sm:flex">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`press-feedback rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                tab === t.id ? 'bg-accent text-white' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>

        <SettingsPanel onSaved={onConfigSaved} />
      </div>

      <nav className="flex gap-1 overflow-x-auto border-t border-stone-200/80 px-5 py-2 sm:hidden">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`press-feedback shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              tab === t.id ? 'bg-accent text-white' : 'text-stone-600'
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>
    </header>
  );
}
