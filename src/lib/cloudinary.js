import { getCloudinaryConfig } from '../config.js';

/**
 * Insert a Cloudinary transformation string into a delivery URL.
 * res.cloudinary.com/<cloud>/image/upload/v123/folder/name.jpg
 *                                    ^ transformation goes right here
 */
export function buildTransformUrl(secureUrl, transformation) {
  if (!secureUrl) return '';
  return secureUrl.replace('/upload/', `/upload/${transformation}/`);
}

// Always-on delivery optimization - automatic format (WebP/AVIF where
// supported) + automatic quality. This is what actually saves the seller's
// buyers mobile data, and it's free on every Cloudinary account.
export const DELIVERY = 'f_auto,q_auto';

// Always-available studio pass (no add-on / activation needed).
export const ENHANCE_STEP = 'e_improve,e_auto_contrast,e_sharpen:60';

// Requires the "AI Background Removal" add-on to be enabled on the account.
// Gated behind a toggle in the UI - see StudioResult.jsx - so a fresh,
// unconfigured account still has a working demo by default.
export const BACKGROUND_REMOVE_STEP = 'e_background_removal/e_improve';

/** Full preview URL for a given studio step (chained + final delivery pass). */
export function studioPreviewUrl(secureUrl, studioStep) {
  return buildTransformUrl(secureUrl, `${studioStep}/${DELIVERY}`);
}

// The multi-platform crop pack. g_auto = content-aware "smart" gravity, so
// the product stays framed instead of getting a dumb center-crop.
export const PLATFORM_PACK = [
  { id: 'ig-feed', label: 'Instagram feed', ratio: '1:1', crop: 'c_fill,g_auto,w_1080,h_1080' },
  { id: 'story', label: 'WhatsApp / IG story', ratio: '9:16', crop: 'c_fill,g_auto,w_1080,h_1920' },
  { id: 'marketplace', label: 'Facebook Marketplace', ratio: '4:3', crop: 'c_fill,g_auto,w_1200,h_900' },
  { id: 'web', label: 'Web thumbnail', ratio: '16:9', crop: 'c_fill,g_auto,w_960,h_540' },
];

/** Builds one platform-pack crop, chained on top of whichever studio step is active. */
export function packUrl(secureUrl, studioStep, crop) {
  return buildTransformUrl(secureUrl, `${studioStep}/${crop},${DELIVERY}`);
}

/** HEAD-fetches a delivery URL to read its real byte size for the
 *  before/after optimization stat. Gracefully returns null if the CDN
 *  doesn't expose Content-Length cross-origin - never breaks the UI. */
export async function fetchDeliveredBytes(url) {
  try {
    const res = await fetch(url, { method: 'HEAD' });
    const len = res.headers.get('content-length');
    return len ? Number(len) : null;
  } catch {
    return null;
  }
}

/**
 * Opens Cloudinary's real Upload Widget. Resolves with the widget's
 * `info` object (public_id, secure_url, bytes, tags, context, ...) on
 * success, rejects on error/close-without-upload.
 */
export function openUploadWidget() {
  const { cloudName, uploadPreset } = getCloudinaryConfig();
  return new Promise((resolve, reject) => {
    if (!window.cloudinary) {
      reject(new Error('Cloudinary widget script did not load (check your network / ad-blocker).'));
      return;
    }
    if (!cloudName || !uploadPreset) {
      reject(new Error('MISSING_CONFIG'));
      return;
    }
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName,
        uploadPreset,
        sources: ['local', 'camera', 'url'],
        multiple: false,
        maxFiles: 1,
        cropping: false,
        showAdvancedOptions: false,
        styles: {
          palette: {
            window: '#FAFAF9',
            windowBorder: '#E7E5E4',
            tabIcon: '#BF5B2E',
            menuIcons: '#78716C',
            textDark: '#1C1917',
            textLight: '#FFFFFF',
            link: '#BF5B2E',
            action: '#BF5B2E',
            inactiveTabIcon: '#A8A29E',
            error: '#B91C1C',
            inProgress: '#BF5B2E',
            complete: '#15803D',
            sourceBg: '#F5F5F4',
          },
          fonts: {
            "'Manrope', sans-serif": {
              url: 'https://fonts.googleapis.com/css2?family=Manrope:wght@500',
              active: true,
            },
          },
        },
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        if (result.event === 'success') {
          resolve(result.info);
          widget.close();
        }
        if (result.event === 'close' || result.event === 'abort') {
          // no-op; caller only awaits the promise on success
        }
      }
    );
    widget.open();
  });
}

// ---- Catalog: a real local "database" - each row is just a pointer back
// to a Cloudinary public_id, plus the structured metadata the seller typed
// in (or that an auto-tagging add-on returned, if configured on the preset).

const CATALOG_KEY = 'dukaan_catalog';

export function getCatalog() {
  try {
    return JSON.parse(localStorage.getItem(CATALOG_KEY) || '[]');
  } catch {
    return [];
  }
}

export function saveCatalogItem(item) {
  const catalog = getCatalog();
  catalog.unshift({ ...item, id: item.id || crypto.randomUUID(), createdAt: Date.now() });
  localStorage.setItem(CATALOG_KEY, JSON.stringify(catalog));
  return catalog;
}

export function deleteCatalogItem(id) {
  const catalog = getCatalog().filter((item) => item.id !== id);
  localStorage.setItem(CATALOG_KEY, JSON.stringify(catalog));
  return catalog;
}

/** Simple client-side search over tags / title / category. */
export function searchCatalog(query, category) {
  const q = (query || '').trim().toLowerCase();
  return getCatalog().filter((item) => {
    const matchesCategory = !category || category === 'all' || item.category === category;
    if (!matchesCategory) return false;
    if (!q) return true;
    const haystack = [item.title, item.category, ...(item.tags || [])].join(' ').toLowerCase();
    return haystack.includes(q);
  });
}
