// Dukaan Studio config.
//
// Fill these in with your own Cloudinary account, OR leave them blank and
// set them from the Settings panel in the running app (gear icon, top right)
// - it writes to localStorage so you never have to rebuild mid-hackathon.
//
// Cloud name: Console -> Dashboard -> "Cloud name"
// Upload preset: Console -> Settings -> Upload -> Add upload preset
//   -> Signing Mode: **Unsigned** (required - this app never touches your
//   API secret, uploads go straight from the browser to Cloudinary).
//
// To unlock auto-tagging + structured metadata + background removal,
// configure them ON THE PRESET itself (Console -> that preset -> Media
// Analysis / Add-ons section), not in this file - unsigned uploads only
// honor settings baked into the preset, for security.

const FALLBACK_CLOUD_NAME = '';
const FALLBACK_UPLOAD_PRESET = '';

export function getCloudinaryConfig() {
  return {
    cloudName: localStorage.getItem('dukaan_cloud_name') || FALLBACK_CLOUD_NAME,
    uploadPreset: localStorage.getItem('dukaan_upload_preset') || FALLBACK_UPLOAD_PRESET,
  };
}

export function setCloudinaryConfig({ cloudName, uploadPreset }) {
  localStorage.setItem('dukaan_cloud_name', cloudName || '');
  localStorage.setItem('dukaan_upload_preset', uploadPreset || '');
}

export function isConfigured() {
  const { cloudName, uploadPreset } = getCloudinaryConfig();
  return Boolean(cloudName && uploadPreset);
}
