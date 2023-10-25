import { useState, useEffect } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import DefaultMarker from "../components/DefaultMarker";
import Spinner from "../components/Spinner";
import { fetchBooks } from "../helpers/book";

function ClusterMap({ isLoading, setIsLoading }) {
  const [books, setBooks] = useState([]);
  const mapCenter = {
    lat: 47.17128,
    lng: 19.50108,
  };

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const data = await fetchBooks();
      const { books } = data;
      setBooks(books);
      setIsLoading(false);
    })();
  }, [setIsLoading]);

  if (isLoading) {
    return <Spinner />;
  }
  return (
    <MapContainer
      style={{
        height: "85vh",
        width: "100%",
      }}
      center={[mapCenter.lat, mapCenter.lng]}
      zoom={7}
      maxZoom={22}
      scrollWheelZoom={true}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MarkerClusterGroup chunkedLoading>
        {books &&
          books.map((book) => (
            <DefaultMarker
              position={[book.geolocation.lat, book.geolocation.lng]}
              key={book.id}
              title={book.title}
              author={book.author}
            ></DefaultMarker>
          ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
}

export default ClusterMap;
