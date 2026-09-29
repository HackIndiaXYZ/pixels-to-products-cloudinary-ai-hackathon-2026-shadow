import { useState } from 'react';
import { getCloudinaryConfig, setCloudinaryConfig } from '../config.js';
import { IconSettings, IconClose, IconCheck } from './icons.jsx';

export default function SettingsPanel({ onSaved }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(getCloudinaryConfig());
  const [saved, setSaved] = useState(false);

  function submit(e) {
    e.preventDefault();
    setCloudinaryConfig(form);
    setSaved(true);
    onSaved?.();
    setTimeout(() => setSaved(false), 1800);
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Cloudinary settings"
        className="press-feedback grid h-10 w-10 place-items-center rounded-full border border-stone-200 text-stone-600 hover:border-accent hover:text-accent transition-colors"
      >
        <IconSettings className="h-5 w-5" />
      </button>

      {open && (
        <div className="animate-rise absolute right-0 z-30 mt-3 w-80 rounded-2xl border border-stone-200 bg-white p-5 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)]">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-display text-sm font-semibold text-stone-900">Your Cloudinary account</h3>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close settings">
              <IconClose className="h-4 w-4 text-stone-400 hover:text-stone-700" />
            </button>
          </div>
          <p className="mb-4 text-xs leading-relaxed text-stone-500">
            Free at cloudinary.com. Cloud name is on your dashboard; the preset is Settings
            &rarr; Upload &rarr; Add upload preset, Signing Mode set to <strong>Unsigned</strong>.
          </p>
          <form onSubmit={submit} className="space-y-3">
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-stone-600">Cloud name</span>
              <input
                value={form.cloudName}
                onChange={(e) => setForm({ ...form, cloudName: e.target.value.trim() })}
                placeholder="e.g. dukaan-studio-demo"
                className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm outline-none focus:border-accent"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-stone-600">Upload preset name</span>
              <input
                value={form.uploadPreset}
                onChange={(e) => setForm({ ...form, uploadPreset: e.target.value.trim() })}
                placeholder="e.g. dukaan_unsigned"
                className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm outline-none focus:border-accent"
              />
            </label>
            <button
              type="submit"
              className="press-feedback flex w-full items-center justify-center gap-2 rounded-lg bg-accent py-2.5 text-sm font-semibold text-white hover:bg-accent-dark transition-colors"
            >
              {saved ? (
                <>
                  <IconCheck className="h-4 w-4" /> Saved
                </>
              ) : (
                'Save'
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
