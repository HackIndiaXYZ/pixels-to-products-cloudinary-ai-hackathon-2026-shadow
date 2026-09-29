import { useState } from 'react';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import StudioResult from './components/StudioResult.jsx';
import Catalog from './components/Catalog.jsx';
import ReelMaker from './components/ReelMaker.jsx';
import { openUploadWidget } from './lib/cloudinary.js';
import { isConfigured } from './config.js';

export default function App() {
  const [tab, setTab] = useState('studio');
  const [asset, setAsset] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  async function handleUploadClick() {
    setError('');
    if (!isConfigured()) {
      setError('Add your Cloudinary cloud name and unsigned upload preset first — gear icon, top right.');
      return;
    }
    setBusy(true);
    try {
      const info = await openUploadWidget();
      setAsset(info);
    } catch (err) {
      if (err?.message !== 'MISSING_CONFIG') {
        setError('Upload did not complete. Try again, or check your preset is set to Unsigned.');
      }
    } finally {
      setBusy(false);
    }
  }

  function handleSaved() {
    setRefreshKey((k) => k + 1);
    setTimeout(() => {
      setAsset(null);
      setTab('catalog');
    }, 900);
  }

  return (
    <div className="min-h-full">
      <Header tab={tab} setTab={setTab} onConfigSaved={() => setError('')} />

      {error && (
        <div className="mx-auto max-w-6xl px-5 pt-4 sm:px-8">
          <p className="animate-rise rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">{error}</p>
        </div>
      )}

      {tab === 'studio' &&
        (asset ? (
          <StudioResult key={asset.public_id} asset={asset} onSaved={handleSaved} />
        ) : (
          <>
            <Hero onUploadClick={handleUploadClick} busy={busy} />
            <HowItWorks />
          </>
        ))}

      {tab === 'catalog' && <Catalog refreshKey={refreshKey} />}
      {tab === 'reel' && <ReelMaker key={refreshKey} />}

      <Footer />
    </div>
  );
}

function HowItWorks() {
  const steps = [
    { n: '01', t: 'Upload', d: 'One raw photo, straight from a phone, goes to Cloudinary via its real upload widget.' },
    { n: '02', t: 'Transform', d: 'A studio pass runs — enhance, and optionally AI background removal.' },
    { n: '03', t: 'Pack & tag', d: 'Four platform-ready crops render instantly, with structured metadata attached.' },
    { n: '04', t: 'List & share', d: 'It lands in a searchable catalog, ready for a reel or a direct download.' },
  ];
  return (
    <section className="mx-auto max-w-6xl px-5 pb-24 sm:px-8">
      <div className="grid gap-px overflow-hidden rounded-3xl border border-stone-200 bg-stone-200 sm:grid-cols-4">
        {steps.map((s, i) => (
          <div key={s.n} className="animate-rise bg-white p-6" style={{ animationDelay: `${i * 80}ms` }}>
            <span className="font-display text-xs font-semibold text-accent">{s.n}</span>
            <h3 className="mt-2 font-display text-sm font-semibold text-stone-900">{s.t}</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-stone-500">{s.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-stone-200 py-8 text-center text-xs text-stone-400">
      Built for HackIndia × Cloudinary — every image above is served, transformed, and optimized by Cloudinary.
    </footer>
  );
}
