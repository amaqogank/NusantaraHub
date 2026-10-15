import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Map, AdvancedMarker, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { MapPin, Navigation, Truck, Store, Layers } from 'lucide-react';

export interface LatLngLiteral {
  lat: number;
  lng: number;
}

export interface MapPinData {
  lat: number;
  lng: number;
  label?: string;
  title?: string;
  color?: 'emerald' | 'blue' | 'amber' | 'rose' | 'slate';
  badge?: string;
}

export interface GoogleMapViewProps {
  center: LatLngLiteral;
  zoom?: number;
  className?: string;
  originPin?: MapPinData;
  destinationPin?: MapPinData;
  courierPin?: {
    lat: number;
    lng: number;
    plateNumber?: string;
    label?: string;
  };
  showRoute?: boolean;
  interactive?: boolean;
  onPinpointChange?: (coords: LatLngLiteral) => void;
  height?: string;
}

// Subcomponent to handle dynamic route calculation and polyline rendering
const RouteController: React.FC<{
  origin: LatLngLiteral;
  destination: LatLngLiteral;
  courier?: LatLngLiteral;
}> = ({ origin, destination, courier }) => {
  const map = useMap();
  const routesLib = useMapsLibrary('routes');
  const polylinesRef = useRef<google.maps.Polyline[]>([]);

  useEffect(() => {
    if (!map || !origin || !destination) return;

    // Clean up previous polylines
    polylinesRef.current.forEach((p) => p.setMap(null));
    polylinesRef.current = [];

    // Fit bounds so all pins are visible
    try {
      if (typeof google !== 'undefined' && google.maps) {
        const bounds = new google.maps.LatLngBounds();
        bounds.extend(new google.maps.LatLng(origin.lat, origin.lng));
        bounds.extend(new google.maps.LatLng(destination.lat, destination.lng));
        if (courier) {
          bounds.extend(new google.maps.LatLng(courier.lat, courier.lng));
        }
        map.fitBounds(bounds, { top: 45, right: 45, bottom: 45, left: 45 });
      }
    } catch {
      // Ignore if bounds construction fails before map is ready
    }

    let isCancelled = false;

    // Attempt Routes API computeRoutes first
    if (routesLib?.Route && typeof (routesLib.Route as any).computeRoutes === 'function') {
      const request = {
        origin: { lat: origin.lat, lng: origin.lng },
        destination: { lat: destination.lat, lng: destination.lng },
        travelMode: 'DRIVING',
        fields: ['path', 'viewport'],
      };

      (routesLib.Route as any)
        .computeRoutes(request)
        .then(({ routes }: { routes: any[] }) => {
          if (isCancelled) return;
          if (routes && routes.length > 0 && typeof routes[0].createPolylines === 'function') {
            const lines = routes[0].createPolylines();
            lines.forEach((line: google.maps.Polyline) => {
              line.setOptions({
                strokeColor: '#059669',
                strokeWeight: 5,
                strokeOpacity: 0.85,
              });
              line.setMap(map);
              polylinesRef.current.push(line);
            });
            return;
          }
          drawFallbackPolyline();
        })
        .catch(() => {
          if (!isCancelled) {
            drawFallbackPolyline();
          }
        });
    } else {
      drawFallbackPolyline();
    }

    function drawFallbackPolyline() {
      if (!map || isCancelled || typeof google === 'undefined' || !google.maps) return;
      const points: LatLngLiteral[] = courier
        ? [origin, courier, destination]
        : [origin, destination];

      const directLine = new google.maps.Polyline({
        path: points.map((p) => ({ lat: p.lat, lng: p.lng })),
        geodesic: true,
        strokeColor: '#059669',
        strokeOpacity: 0.85,
        strokeWeight: 4,
      });
      directLine.setMap(map);
      polylinesRef.current.push(directLine);
    }

    return () => {
      isCancelled = true;
      polylinesRef.current.forEach((p) => p.setMap(null));
      polylinesRef.current = [];
    };
  }, [map, routesLib, origin.lat, origin.lng, destination.lat, destination.lng, courier?.lat, courier?.lng]);

  return null;
};

// Subcomponent to handle map clicks when interactive
const MapClickHandler: React.FC<{
  onMapClick?: (coords: LatLngLiteral) => void;
}> = ({ onMapClick }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !onMapClick) return;
    const listener = map.addListener('click', (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        onMapClick({
          lat: e.latLng.lat(),
          lng: e.latLng.lng(),
        });
      }
    });

    return () => {
      listener.remove();
    };
  }, [map, onMapClick]);

  return null;
};

export const GoogleMapView: React.FC<GoogleMapViewProps> = ({
  center,
  zoom = 13,
  className = '',
  originPin,
  destinationPin,
  courierPin,
  showRoute = true,
  interactive = false,
  onPinpointChange,
  height = '240px',
}) => {
  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'hybrid'>('roadmap');

  return (
    <div 
      className={`relative rounded-xl overflow-hidden border border-slate-200 shadow-xs ${className}`}
      style={{ height }}
    >
      <Map
        mapId="DEMO_MAP_ID"
        defaultCenter={center}
        defaultZoom={zoom}
        center={center}
        mapTypeId={mapType}
        gestureHandling="greedy"
        disableDefaultUI={false}
        mapTypeControl={false}
        streetViewControl={false}
        fullscreenControl={true}
        zoomControl={true}
        internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
        style={{ width: '100%', height: '100%' }}
      >
        {/* Origin Pin (Toko / Pickup) */}
        {originPin && (
          <AdvancedMarker
            position={{ lat: originPin.lat, lng: originPin.lng }}
            title={originPin.title || originPin.label || 'Titik Asal / Toko'}
          >
            <div className="flex flex-col items-center select-none group">
              <div className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md border border-blue-400 whitespace-nowrap mb-0.5 flex items-center gap-1">
                <Store className="w-3 h-3" />
                <span>{originPin.badge || 'Toko (A)'}</span>
              </div>
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white border-2 border-white shadow-lg flex items-center justify-center font-bold text-xs ring-2 ring-blue-400/40">
                A
              </div>
              {originPin.label && (
                <div className="mt-1 bg-slate-900/90 text-white text-[9px] px-1.5 py-0.5 rounded border border-slate-700 max-w-[120px] truncate shadow">
                  {originPin.label}
                </div>
              )}
            </div>
          </AdvancedMarker>
        )}

        {/* Destination Pin (Tujuan Antar) */}
        {destinationPin && (
          <AdvancedMarker
            position={{ lat: destinationPin.lat, lng: destinationPin.lng }}
            title={destinationPin.title || destinationPin.label || 'Titik Antar'}
          >
            <div className="flex flex-col items-center select-none group">
              <div className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md border border-emerald-400 whitespace-nowrap mb-0.5 flex items-center gap-1">
                <Navigation className="w-3 h-3" />
                <span>{destinationPin.badge || 'Tujuan (B)'}</span>
              </div>
              <div className="w-7 h-7 rounded-full bg-emerald-600 text-white border-2 border-white shadow-lg flex items-center justify-center font-bold text-xs ring-2 ring-emerald-400/40">
                B
              </div>
              {destinationPin.label && (
                <div className="mt-1 bg-slate-900/90 text-white text-[9px] px-1.5 py-0.5 rounded border border-slate-700 max-w-[120px] truncate shadow">
                  {destinationPin.label}
                </div>
              )}
            </div>
          </AdvancedMarker>
        )}

        {/* Live Moving Courier Pin */}
        {courierPin && (
          <AdvancedMarker
            position={{ lat: courierPin.lat, lng: courierPin.lng }}
            title={`Kurir Aktif: ${courierPin.plateNumber || 'Armada'}`}
          >
            <div className="flex flex-col items-center select-none animate-bounce duration-1000">
              <div className="bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg border border-amber-300 whitespace-nowrap mb-0.5 flex items-center gap-1">
                <Truck className="w-3 h-3" />
                <span>{courierPin.plateNumber || 'Kurir On-Delivery'}</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-amber-500 text-white border-2 border-white shadow-xl flex items-center justify-center font-bold text-xs ring-4 ring-amber-400/50">
                🏍️
              </div>
            </div>
          </AdvancedMarker>
        )}

        {/* Route Polyline */}
        {showRoute && originPin && destinationPin && (
          <RouteController
            origin={{ lat: originPin.lat, lng: originPin.lng }}
            destination={{ lat: destinationPin.lat, lng: destinationPin.lng }}
            courier={courierPin ? { lat: courierPin.lat, lng: courierPin.lng } : undefined}
          />
        )}

        {/* Click listener for interactive pin relocation */}
        {interactive && onPinpointChange && (
          <MapClickHandler onMapClick={onPinpointChange} />
        )}
      </Map>

      {/* Floating Map Controls & Badges */}
      <div className="absolute top-2 left-2 z-10 flex items-center gap-1.5 pointer-events-auto">
        <div className="bg-slate-900/85 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-1 rounded-md border border-slate-700/80 shadow-md flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Google Maps Live</span>
        </div>

        {interactive && (
          <div className="hidden sm:inline-flex bg-white/90 backdrop-blur-xs text-slate-800 text-[10px] font-semibold px-2 py-1 rounded-md border border-slate-200 shadow-md">
            Klik peta untuk geser titik
          </div>
        )}
      </div>

      {/* Map Layer Switcher (Roadmap / Satellite) */}
      <div className="absolute top-2 right-2 z-10 pointer-events-auto">
        <button
          type="button"
          onClick={() => setMapType((prev) => (prev === 'roadmap' ? 'hybrid' : 'roadmap'))}
          className="bg-white/90 hover:bg-white text-slate-700 hover:text-slate-900 text-[10px] font-semibold px-2 py-1 rounded-md border border-slate-300 shadow-md flex items-center gap-1 transition-colors"
          title="Ganti Tampilan Peta"
        >
          <Layers className="w-3 h-3 text-emerald-600" />
          <span>{mapType === 'roadmap' ? 'Satelit' : 'Jalan'}</span>
        </button>
      </div>
    </div>
  );
};
