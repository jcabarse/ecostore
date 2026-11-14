"use client";
import { useCallback, useEffect, useRef, useState } from 'react';
import { STORE, fullAddress, googleMapsLink, googleDirectionsLink } from '../lib/storeInfo';

// Starting view: the whole Philippines. Then the map "flies" down to the shop.
const PH_VIEW = { center: [12.5, 122.3], zoom: 5 };
const STORE_ZOOM = 16;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function LocationMap() {
  const wrapRef = useRef(null);
  const mapElRef = useRef(null);
  const mapRef = useRef(null); // { L, map, marker }
  const flownRef = useRef(false);

  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [zoomedIn, setZoomedIn] = useState(false);

  const flyToStore = useCallback(() => {
    const m = mapRef.current;
    if (!m) return;
    m.map.closePopup();
    m.map.once('moveend', () => m.marker.openPopup());
    m.map.flyTo([STORE.lat, STORE.lng], STORE_ZOOM, {
      duration: prefersReducedMotion() ? 0 : 3.6,
      easeLinearity: 0.25,
    });
    setZoomedIn(true);
  }, []);

  const flyToPhilippines = useCallback(() => {
    const m = mapRef.current;
    if (!m) return;
    m.map.closePopup();
    m.map.flyTo(PH_VIEW.center, PH_VIEW.zoom, {
      duration: prefersReducedMotion() ? 0 : 2.4,
      easeLinearity: 0.25,
    });
    setZoomedIn(false);
  }, []);

  const replay = useCallback(() => {
    const m = mapRef.current;
    if (!m) return;
    m.map.closePopup();
    m.map.setView(PH_VIEW.center, PH_VIEW.zoom, { animate: false });
    setZoomedIn(false);
    setTimeout(flyToStore, 350);
  }, [flyToStore]);

  useEffect(() => {
    let cancelled = false;
    let observer;
    let timer;

    (async () => {
      try {
        const mod = await import('leaflet');
        const L = mod.default || mod;
        if (cancelled || !mapElRef.current) return;

        const map = L.map(mapElRef.current, {
          center: PH_VIEW.center,
          zoom: PH_VIEW.zoom,
          zoomControl: false,
          scrollWheelZoom: false, // enabled after the first click so the page can still scroll
          zoomSnap: 0.5,
          worldCopyJump: true,
        });

        L.control.zoom({ position: 'bottomright' }).addTo(map);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
        }).addTo(map);

        const icon = L.divIcon({
          className: 'eco-pin',
          html:
            '<span class="eco-pin__pulse"></span>' +
            '<span class="eco-pin__pulse eco-pin__pulse--2"></span>' +
            '<span class="eco-pin__dot">' +
            '<svg width="20" height="20" viewBox="0 0 24 24" fill="#FDFBF7" aria-hidden="true">' +
            '<path d="M21 3C11 3 4 9 4 17c0 1.2.2 2.3.6 3.3C5.6 20.7 6.8 21 8 21c8 0 13-7 13-18z"/></svg>' +
            '</span>',
          iconSize: [48, 48],
          iconAnchor: [24, 24],
          popupAnchor: [0, -22],
        });

        const marker = L.marker([STORE.lat, STORE.lng], { icon, title: STORE.name }).addTo(map);
        marker.bindPopup(
          `<strong style="color:#1B4332;font-size:15px">${STORE.name}</strong><br/>` +
            `${STORE.barangay}, ${STORE.city}<br/>${STORE.province}, ${STORE.country}`
        );

        // Scroll-wheel zoom only after the visitor clicks the map
        map.on('click', () => map.scrollWheelZoom.enable());
        map.getContainer().addEventListener('mouseleave', () => map.scrollWheelZoom.disable());

        mapRef.current = { L, map, marker };
        setReady(true);

        // Fly in automatically the first time the map scrolls into view
        observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting && !flownRef.current) {
              flownRef.current = true;
              timer = setTimeout(flyToStore, 600);
            }
          },
          { threshold: 0.45 }
        );
        if (wrapRef.current) observer.observe(wrapRef.current);
      } catch (err) {
        console.error('Could not load the map:', err);
        if (!cancelled) setFailed(true);
      }
    })();

    return () => {
      cancelled = true;
      clearTimeout(timer);
      if (observer) observer.disconnect();
      if (mapRef.current) {
        mapRef.current.map.remove();
        mapRef.current = null;
      }
    };
  }, [flyToStore]);

  const d = 0.008;
  const fallbackSrc =
    `https://www.openstreetmap.org/export/embed.html?bbox=${STORE.lng - d * 1.6}%2C${STORE.lat - d}%2C${STORE.lng + d * 1.6}%2C${STORE.lat + d}` +
    `&layer=mapnik&marker=${STORE.lat}%2C${STORE.lng}`;

  return (
    <div ref={wrapRef}>
      {/* isolate keeps Leaflet's high z-index layers from covering the sticky nav */}
      <div className="relative isolate overflow-hidden rounded-3xl border border-[#B7E4C7] bg-[#E9F5EE] shadow-[0_20px_50px_rgba(27,67,50,0.15)]">
        {failed ? (
          <iframe
            title={`Map of ${STORE.name}`}
            src={fallbackSrc}
            className="block h-[420px] w-full sm:h-[540px]"
            loading="lazy"
          />
        ) : (
          <>
            <div
              ref={mapElRef}
              className="h-[420px] w-full sm:h-[540px]"
              role="region"
              aria-label={`Interactive map showing ${STORE.name} in ${fullAddress}`}
            />
            {!ready && (
              <div className="map-loading absolute inset-0 grid place-items-center bg-[#E9F5EE] text-sm font-semibold text-[#1B4332]">
                Loading map…
              </div>
            )}
          </>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {!failed && (
          <>
            <button
              type="button"
              disabled={!ready}
              onClick={zoomedIn ? flyToPhilippines : flyToStore}
              className="rounded-full bg-[#1B4332] px-5 py-2.5 text-sm font-semibold text-[#FDFBF7] shadow-md transition hover:-translate-y-0.5 hover:bg-[#2D6A4F] disabled:opacity-50"
            >
              {zoomedIn ? 'Zoom out to the Philippines' : 'Zoom in to the shop'}
            </button>
            <button
              type="button"
              disabled={!ready}
              onClick={replay}
              className="rounded-full border-2 border-[#1B4332]/25 px-5 py-2.5 text-sm font-semibold text-[#1B4332] transition hover:border-[#1B4332]/60 hover:bg-white/70 disabled:opacity-50"
            >
               Zoom 
            </button>
          </>
        )}
        <a
          href={googleDirectionsLink}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border-2 border-[#1B4332]/25 px-5 py-2.5 text-sm font-semibold text-[#1B4332] transition hover:border-[#1B4332]/60 hover:bg-white/70"
        >
          Get directions ↗
        </a>
        <a
          href={googleMapsLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold text-[#40916C] underline-offset-4 hover:underline"
        >
          Open in Google Maps
        </a>
      </div>
      {!failed && (
        <p className="mt-2 text-xs text-gray-500">Click the map to enable scroll-wheel zoom. Drag to move around.</p>
      )}
    </div>
  );
}