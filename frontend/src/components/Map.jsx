import { MapContainer, TileLayer } from "react-leaflet";
import DefaultMarker from "./DefaultMarker";

function Map({ mapCenter, author, title }) {
  return (
    <MapContainer
      style={{
        height: "400px",
        width: "100%",
      }}
      center={[mapCenter.lat, mapCenter.lng]}
      zoom={12}
      scrollWheelZoom={true}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <DefaultMarker
        position={[mapCenter.lat, mapCenter.lng]}
        title={title}
        author={author}
      ></DefaultMarker>
    </MapContainer>
  );
}

export default Map;
