import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

import { StampPoint } from "../../types/api";

type Props = {
  points: StampPoint[];
  title?: string;
};

const defaultCenter: [number, number] = [39.0, -6.0];

export function MapPanel({ points, title }: Props) {
  const center: [number, number] = points.length ? [points[0].lat, points[0].lng] : defaultCenter;

  return (
    <section className="map-card">
      {title ? <h3>{title}</h3> : null}
      <div className="map-frame">
        <MapContainer center={center} zoom={8} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
          <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {points.map((point) => (
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

