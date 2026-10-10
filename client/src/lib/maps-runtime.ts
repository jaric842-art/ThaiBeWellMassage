declare global {
  interface Window {
    google?: typeof google;
  }
}

let mapsLoad: Promise<boolean> | null = null;

function getMapsScriptUrl(): string | null {
  const apiBase = import.meta.env.VITE_MANUS_API_URL?.replace(/\/+$/, "");
  const browserKey = import.meta.env.VITE_MANUS_API_BROWSER_KEY;
  if (!apiBase || !browserKey) return null;

  const url = new URL("v1/maps/proxy/maps/api/js", `${apiBase}/`);
  url.searchParams.set("key", browserKey);
  url.searchParams.set("v", "weekly");
  url.searchParams.set("libraries", "marker,places,geocoding,geometry");
  return url.toString();
}

export function loadGoogleMaps(): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false);
  if (window.google?.maps?.places) return Promise.resolve(true);
  if (mapsLoad) return mapsLoad;

  const src = getMapsScriptUrl();
  if (!src) return Promise.resolve(false);

  mapsLoad = new Promise<boolean>((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.defer = true;
    script.dataset.manusMaps = "true";
    script.onload = () => resolve(Boolean(window.google?.maps?.places));
    script.onerror = () => {
      console.error("The managed Maps browser API could not be loaded.");
      mapsLoad = null;
      resolve(false);
    };
    document.head.appendChild(script);
  });
  return mapsLoad;
}
