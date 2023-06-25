import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'



function Map({ mapCenter, author, title}) {
 
    return (
        <MapContainer
        style={{height: "450px", width: "100%"}} 
        center={[mapCenter.lat, mapCenter.lng]}
        zoom={12} 
        scrollWheelZoom={false}  
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
            <Marker position={[mapCenter.lat, mapCenter.lng]}>
              <Popup>
                {author}: <br /> {title}
              </Popup>
            </Marker>
      </MapContainer>
    )
}

export default Map
