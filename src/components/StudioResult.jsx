import { useEffect, useState } from 'react';
import {
  ENHANCE_STEP,
  BACKGROUND_REMOVE_STEP,
  studioPreviewUrl,
  packUrl,
  PLATFORM_PACK,
  fetchDeliveredBytes,
  saveCatalogItem,
} from '../lib/cloudinary.js';
import { IconSparkle, IconDownload, IconCheck, IconTag } from './icons.jsx';

const CATEGORIES = ['Apparel', 'Jewellery', 'Home & decor', 'Food', 'Beauty', 'Plants', 'Other'];

function formatBytes(n) {
  if (!n && n !== 0) return null;
  return n > 1024 * 1024 ? `${(n / (1024 * 1024)).toFixed(1)} MB` : `${(n / 1024).toFixed(0)} KB`;
}

export default function StudioResult({ asset, onSaved }) {
  const [bgOn, setBgOn] = useState(false);
  const [bgFailed, setBgFailed] = useState(false);
  const [deliveredBytes, setDeliveredBytes] = useState(null);
  const [form, setForm] = useState({ title: '', category: CATEGORIES[0], price: '', tags: '' });
  const [saved, setSaved] = useState(false);

  const studioStep = bgOn && !bgFailed ? BACKGROUND_REMOVE_STEP : ENHANCE_STEP;
  const previewUrl = studioPreviewUrl(asset.secure_url, studioStep);

  useEffect(() => {
    setDeliveredBytes(null);
    fetchDeliveredBytes(previewUrl).then(setDeliveredBytes);
  }, [previewUrl]);

  const originalKB = formatBytes(asset.bytes);
  const deliveredKB = formatBytes(deliveredBytes);
  const savingsPct =
    asset.bytes && deliveredBytes ? Math.max(0, Math.round((1 - deliveredBytes / asset.bytes) * 100)) : null;

  function save(e) {
    e.preventDefault();
    if (!form.title.trim()) return;
    const manualTags = form.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    const autoTags = Array.isArray(asset.tags) ? asset.tags : [];

    saveCatalogItem({
      publicId: asset.public_id,
      secureUrl: asset.secure_url,
      studioStep,
      title: form.title.trim(),
      category: form.category,
      price: form.price,
      tags: Array.from(new Set([...autoTags, ...manualTags, form.category.toLowerCase()])),
    });
    setSaved(true);
    onSaved?.();
  }

  return (
    <section className="animate-rise mx-auto max-w-6xl px-5 pb-20 sm:px-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
        {/* Before / after */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-stone-900">Studio pass</h2>
            <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-stone-600">
              <span>Background removal (add-on)</span>
              <button
                type="button"
                role="switch"
                aria-checked={bgOn}
                onClick={() => {
                  setBgFailed(false);
                  setBgOn((v) => !v);
                }}
                className={`press-feedback relative h-6 w-11 rounded-full transition-colors ${bgOn ? 'bg-accent' : 'bg-stone-300'
                  }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 -ml-5.5 rounded-full bg-white shadow transition-transform ${bgOn ? 'translate-x-5.5' : 'translate-x-0.5'
                    }`}
                />
              </button>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <figure>
              <div className="aspect-square overflow-hidden rounded-2xl border border-stone-200 bg-stone-100">
                <img src={asset.secure_url} alt="Original upload" className="h-full w-full object-cover" />
              </div>
              <figcaption className="mt-2 text-center text-xs text-stone-500">
                Original {originalKB ? `\u00b7 ${originalKB}` : ''}
              </figcaption>
            </figure>
            <figure>
              <div className="aspect-square overflow-hidden rounded-2xl border-2 border-accent bg-stone-100">
                <img
                  key={previewUrl}
                  src={previewUrl}
                  alt="Cloudinary studio pass"
                  className="h-full w-full object-cover"
                  onError={() => bgOn && setBgFailed(true)}
                />
              </div>
              <figcaption className="mt-2 text-center text-xs font-medium text-accent-dark">
                Cloudinary {deliveredKB ? `\u00b7 ${deliveredKB}` : ''}
              </figcaption>
            </figure>
          </div>

          {bgFailed && (
            <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
              Background removal needs the "AI Background Removal" add-on enabled on your Cloudinary account.
              Showing the enhance-only pass instead - see the README to turn it on.
            </p>
          )}

          {savingsPct !== null && savingsPct > 0 && (
            <p className="mt-3 flex items-center gap-1.5 text-xs text-stone-500">
              <IconSparkle className="h-3.5 w-3.5 text-accent" />
              Delivered <strong className="text-stone-700">{savingsPct}% smaller</strong> than the original,
              automatically &mdash; that's the buyer's mobile data, saved by{' '}
              <code className="rounded bg-stone-100 px-1 py-0.5">f_auto,q_auto</code>.
            </p>
          )}

          {/* Platform pack */}
          <h3 className="mb-3 mt-8 font-display text-base font-semibold text-stone-900">Platform pack</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {PLATFORM_PACK.map((p) => {
              const url = packUrl(asset.secure_url, studioStep, p.crop);
              return (
                <a
                  key={p.id}
                  href={url}
                  download
                  target="_blank"
                  rel="noreferrer"
                  className="group press-feedback block overflow-hidden rounded-xl border border-stone-200 bg-white"
                >
                  <div className="relative aspect-square overflow-hidden bg-stone-100">
                    <img src={url} alt={p.label} className="h-full w-full object-cover" loading="lazy" />
                    <span className="absolute right-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-full bg-white/90 text-stone-700 opacity-0 shadow transition-opacity group-hover:opacity-100">
                      <IconDownload className="h-3.5 w-3.5" />
                    </span>
                  </div>
                  <div className="px-2 py-1.5">
                    <p className="truncate text-xs font-medium text-stone-800">{p.label}</p>
                    <p className="text-[11px] text-stone-400">{p.ratio}</p>
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        {/* Quick-tag / save form */}
        <div>
          <h2 className="mb-3 font-display text-lg font-semibold text-stone-900">List it</h2>
          <form
            onSubmit={save}
            className="space-y-4 rounded-2xl border border-stone-200 bg-white p-6 shadow-[0_20px_40px_-25px_rgba(0,0,0,0.15)]"
          >
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-stone-600">Title</span>
              <input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Hand-block-printed cotton kurta"
                className="w-full rounded-lg border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-accent"
              />
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-stone-600">Category</span>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full rounded-lg border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-accent"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-stone-600">Price (&#8377;)</span>
                <input
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="999"
                  className="w-full rounded-lg border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-accent"
                />
              </label>
            </div>

            <label className="block">
              <span className="mb-1 flex items-center gap-1 text-xs font-medium text-stone-600">
                <IconTag className="h-3.5 w-3.5" /> Tags (comma separated)
              </span>
              <input
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                placeholder="cotton, handmade, festive"
                className="w-full rounded-lg border border-stone-200 px-3 py-2.5 text-sm outline-none focus:border-accent"
              />
              {Array.isArray(asset.tags) && asset.tags.length > 0 && (
                <span className="mt-1.5 block text-[11px] text-stone-400">
                  Cloudinary auto-tagged this: {asset.tags.join(', ')}
                </span>
              )}
            </label>

            <button
              type="submit"
              className="press-feedback flex w-full items-center justify-center gap-2 rounded-lg bg-accent py-3 font-display text-sm font-semibold text-white transition-colors hover:bg-accent-dark"
            >
              {saved ? (
                <>
                  <IconCheck className="h-4 w-4" /> Saved to catalog
                </>
              ) : (
                'Save to catalog'
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
