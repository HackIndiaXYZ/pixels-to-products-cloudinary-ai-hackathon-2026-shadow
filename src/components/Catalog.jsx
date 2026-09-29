import { useEffect, useMemo, useState } from 'react';
import { getCatalog, searchCatalog, deleteCatalogItem, studioPreviewUrl } from '../lib/cloudinary.js';
import { IconSearch, IconImage } from './icons.jsx';

const ALL = 'all';

export default function Catalog({ refreshKey }) {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(ALL);

  useEffect(() => {
    setItems(getCatalog());
  }, [refreshKey]);

  const categories = useMemo(() => {
    const set = new Set(items.map((i) => i.category).filter(Boolean));
    return [ALL, ...Array.from(set)];
  }, [items]);

  const results = useMemo(() => searchCatalog(query, category), [query, category, items]);

  function remove(id) {
    setItems(deleteCatalogItem(id));
  }

  return (
    <section className="animate-rise mx-auto max-w-6xl px-5 pb-24 pt-8 sm:px-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-display text-xl font-semibold text-stone-900">
          Your catalog <span className="text-stone-400">&middot; {items.length} listing{items.length === 1 ? '' : 's'}</span>
        </h2>

        <div className="relative w-full sm:w-72">
          <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search title or tag&hellip;"
            className="w-full rounded-full border border-stone-200 bg-white py-2.5 pl-9 pr-4 text-sm outline-none focus:border-accent"
          />
        </div>
      </div>

      {categories.length > 1 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`press-feedback rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                category === c
                  ? 'border-accent bg-accent text-white'
                  : 'border-stone-200 bg-white text-stone-600 hover:border-accent hover:text-accent'
              }`}
            >
              {c === ALL ? 'All' : c}
            </button>
          ))}
        </div>
      )}

      {results.length === 0 ? (
        <div className="animate-rise flex flex-col items-center gap-3 rounded-2xl border border-dashed border-stone-300 bg-white/60 px-6 py-16 text-center">
          <IconImage className="h-8 w-8 text-stone-300" />
          <p className="font-display text-sm font-medium text-stone-700">
            {items.length === 0 ? 'No listings yet' : 'Nothing matches that search'}
          </p>
          <p className="max-w-xs text-xs text-stone-500">
            {items.length === 0
              ? 'Upload a product in the Studio tab and save it - it shows up here automatically.'
              : 'Try a different tag, title, or category.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {results.map((item, i) => (
            <article
              key={item.id}
              className="animate-rise group overflow-hidden rounded-2xl border border-stone-200 bg-white"
              style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}
            >
              <div className="relative aspect-square overflow-hidden bg-stone-100">
                <img
                  src={studioPreviewUrl(item.secureUrl, item.studioStep)}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <button
                  onClick={() => remove(item.id)}
                  className="press-feedback absolute right-2 top-2 rounded-full bg-white/90 px-2 py-1 text-[11px] font-medium text-stone-600 opacity-0 shadow transition-opacity group-hover:opacity-100"
                >
                  Remove
                </button>
              </div>
              <div className="p-3">
                <p className="truncate text-sm font-medium text-stone-900">{item.title}</p>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-xs text-stone-500">{item.category}</span>
                  {item.price && <span className="text-xs font-semibold text-accent-dark">&#8377;{item.price}</span>}
                </div>
                {item.tags?.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {item.tags.slice(0, 3).map((t) => (
                      <span key={t} className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] text-stone-500">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
