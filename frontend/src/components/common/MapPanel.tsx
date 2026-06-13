import { CircleMarker, MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

import { StampPoint } from "../../types/api";

type Props = {
  points: StampPoint[];
  title?: string;
  highlightedPointIds?: number[];
};

const defaultCenter: [number, number] = [39.0, -6.0];

export function MapPanel({ points, title, highlightedPointIds = [] }: Props) {
  const center: [number, number] = points.length ? [points[0].lat, points[0].lng] : defaultCenter;
  const highlightedSet = new Set(highlightedPointIds);

  return (
    <section className="map-card">
      {title ? <h3>{title}</h3> : null}
      <div className="map-frame">
        <MapContainer center={center} zoom={8} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
          <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {highlightedPointIds.length
            ? points.map((point) => {
                const isHighlighted = highlightedSet.has(point.id);
                return (
                  <CircleMarker
                    key={point.id}
                    center={[point.lat, point.lng]}
                    pathOptions={{
                      color: isHighlighted ? "#2d5d47" : "#ab8a45",
                      fillColor: isHighlighted ? "#2d5d47" : "#f3ecdf",
                      fillOpacity: isHighlighted ? 0.92 : 0.78,
                    }}
                    radius={isHighlighted ? 10 : 7}
                  >
                    <Popup>
                      <strong>{point.name}</strong>
                      <p>{point.city}</p>
                      <p>{isHighlighted ? "Sello registrado" : "Pendiente de sello"}</p>
                    </Popup>
                  </CircleMarker>
                );
              })
            : points.map((point) => (
                <Marker key={point.id} position={[point.lat, point.lng]}>
                  <Popup>
                    <strong>{point.name}</strong>
                    <p>{point.city}</p>
                  </Popup>
                </Marker>
              ))}
        </MapContainer>
      </div>
    </section>
  );
}
