import markerIconPng from "../assets/images/marker-icon.png";
import markerShadow from "../assets/images/marker-shadow.png";
import { Icon } from "leaflet";
import { Marker, Popup } from "react-leaflet";

const defaultIcon = new Icon({
  iconUrl: markerIconPng,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  shadowSize: [30, 65],
  iconAnchor: [12, 41],
  shadowAnchor: [7, 65],
});

function DefaultMarker({ position, title, author, id }) {
  return (
    <Marker position={position} icon={defaultIcon}>
      <Popup key={id}>
        {author}: <br /> {title}
      </Popup>
    </Marker>
  );
}

export default DefaultMarker;
