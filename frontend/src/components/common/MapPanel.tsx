import { CircleMarker, MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

import { InterestPoint, StampPoint } from "../../types/api";

type Props = {
  points: StampPoint[];
  interestPoints?: InterestPoint[];
  title?: string;
  highlightedPointIds?: number[];
};

const defaultCenter: [number, number] = [39.0, -6.0];

export function MapPanel({ points, interestPoints = [], title, highlightedPointIds = [] }: Props) {
  const allMapPoints = points.length ? points : interestPoints;
  const center: [number, number] = allMapPoints.length ? [allMapPoints[0].lat, allMapPoints[0].lng] : defaultCenter;
  const highlightedSet = new Set(highlightedPointIds);

  return (
    <section className="map-card">
      {title ? <h3>{title}</h3> : null}
      {interestPoints.length ? (
        <div className="map-legend">
          <span><i className="legend-dot legend-stamp" /> Punto oficial</span>
          <span><i className="legend-dot legend-stamped" /> Punto sellado</span>
          <span><i className="legend-dot legend-interest" /> Punto de interes</span>
        </div>
      ) : null}
      <div className="map-frame">
        <MapContainer center={center} zoom={8} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
          <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {interestPoints.length || highlightedPointIds.length
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
                      <p>{isHighlighted ? "Sello registrado" : "Punto oficial de sellado"}</p>
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
          {interestPoints.map((point) => (
            <CircleMarker
              key={`interest-${point.id}`}
              center={[point.lat, point.lng]}
              pathOptions={{
                color: "#6a4f2d",
                fillColor: "#e8c98e",
                fillOpacity: 0.9,
              }}
              radius={6}
            >
              <Popup>
                <strong>{point.name}</strong>
                <p>{point.point_type}</p>
                <p>{point.city}</p>
                <p>{point.summary}</p>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </section>
  );
}
