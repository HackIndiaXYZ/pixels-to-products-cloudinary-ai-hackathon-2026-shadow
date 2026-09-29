import { useEffect, useRef, useState } from 'react';
import { getCatalog, studioPreviewUrl } from '../lib/cloudinary.js';
import { IconPlay, IconPause, IconFilm, IconCheck } from './icons.jsx';

const SLIDE_MS = 2200;
const MAX_SLIDES = 6;

export default function ReelMaker() {
  const [items] = useState(() => getCatalog());
  const [selected, setSelected] = useState([]);
  const [playing, setPlaying] = useState(false);
  const [index, setIndex] = useState(0);
  const [audioFile, setAudioFile] = useState(null);
  const audioRef = useRef(null);
  const timerRef = useRef(null);

  const slides = items.filter((i) => selected.includes(i.id));

  function toggle(id) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < MAX_SLIDES ? [...prev, id] : prev
    );
  }

  useEffect(() => {
    if (!playing || slides.length === 0) return;
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, SLIDE_MS);
    return () => clearInterval(timerRef.current);
  }, [playing, slides.length]);

  useEffect(() => {
    if (!audioRef.current) return;
    if (playing) audioRef.current.play().catch(() => {});
    else audioRef.current.pause();
  }, [playing]);

  function startOver() {
    setIndex(0);
    setPlaying(true);
  }

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-6xl px-5 py-20 text-center sm:px-8">
        <IconFilm className="mx-auto h-8 w-8 text-stone-300" />
        <p className="mt-3 font-display text-sm font-medium text-stone-700">Nothing to reel yet</p>
        <p className="mt-1 text-xs text-stone-500">Save a few products in the Studio tab first.</p>
      </section>
    );
  }

  return (
    <section className="animate-rise mx-auto max-w-6xl px-5 pb-24 pt-8 sm:px-8">
      <h2 className="font-display text-xl font-semibold text-stone-900">Reel maker</h2>
      <p className="mt-1 max-w-[60ch] text-sm text-stone-500">
        Pick 2&ndash;{MAX_SLIDES} products. This builds an in-browser crossfade reel from the real
        Cloudinary-delivered images &mdash; a demo-grade stand-in for Cloudinary's server-side video
        slideshow API (see the README for the production path).
      </p>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_1.1fr]">
        {/* Picker */}
        <div>
          <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
            {items.map((item) => {
              const on = selected.includes(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => toggle(item.id)}
                  className={`press-feedback relative aspect-square overflow-hidden rounded-xl border-2 transition-colors ${
                    on ? 'border-accent' : 'border-transparent'
                  }`}
                >
                  <img
                    src={studioPreviewUrl(item.secureUrl, item.studioStep)}
                    alt={item.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                  {on && (
                    <span className="absolute right-1.5 top-1.5 grid h-5 w-5 place-items-center rounded-full bg-accent text-white">
                      <IconCheck className="h-3 w-3" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <label className="mt-5 flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-stone-300 bg-white px-4 py-3 text-xs text-stone-600">
            <span className="font-medium text-stone-800">Add your own audio (optional)</span>
            <input
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={(e) => setAudioFile(e.target.files?.[0] ? URL.createObjectURL(e.target.files[0]) : null)}
            />
            <span className="ml-auto rounded-full bg-stone-100 px-2.5 py-1 text-[11px]">
              {audioFile ? 'Loaded' : 'Choose file'}
            </span>
          </label>

          <button
            onClick={startOver}
            disabled={slides.length < 2}
            className="press-feedback mt-5 w-full rounded-full bg-accent py-3 font-display text-sm font-semibold text-white transition-colors hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-40"
          >
            {slides.length < 2 ? 'Select at least 2 products' : `Play reel (${slides.length} slides)`}
          </button>
        </div>

        {/* Player */}
        <div className="mx-auto w-full max-w-[280px]">
          <div className="relative aspect-[9/16] overflow-hidden rounded-[28px] border border-stone-200 bg-stone-900 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.35)]">
            {slides.length === 0 ? (
              <div className="grid h-full place-items-center text-center text-xs text-stone-400">
                Your reel preview
                <br />
                will play here
              </div>
            ) : (
              slides.map((s, i) => (
                <img
                  key={s.id}
                  src={studioPreviewUrl(s.secureUrl, s.studioStep)}
                  alt={s.title}
                  className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
                  style={{ opacity: i === index ? 1 : 0 }}
                />
              ))
            )}

            {slides.length > 0 && (
              <>
                <div className="absolute inset-x-3 top-3 flex gap-1">
                  {slides.map((_, i) => (
                    <span key={i} className="h-0.5 flex-1 overflow-hidden rounded-full bg-white/30">
                      <span
                        className="block h-full bg-white transition-all"
                        style={{ width: i === index ? '100%' : i < index ? '100%' : '0%' }}
                      />
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => setPlaying((p) => !p)}
                  className="press-feedback absolute bottom-3 right-3 grid h-11 w-11 place-items-center rounded-full bg-white/90 text-stone-800 shadow"
                >
                  {playing ? <IconPause className="h-5 w-5" /> : <IconPlay className="h-5 w-5" />}
                </button>
                <div className="absolute bottom-4 left-4 max-w-[65%] text-white">
                  <p className="truncate text-sm font-semibold drop-shadow">{slides[index]?.title}</p>
                  {slides[index]?.price && (
                    <p className="text-xs opacity-90 drop-shadow">&#8377;{slides[index].price}</p>
                  )}
                </div>
              </>
            )}
          </div>
          {audioFile && <audio ref={audioRef} src={audioFile} loop className="hidden" />}
        </div>
      </div>
    </section>
  );
}
