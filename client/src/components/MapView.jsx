import React from 'react';
import { useSelector } from 'react-redux';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MapView = () => {
  const { searchResult } = useSelector((state) => state.maps);
  const mapStyles = {
    height: "100vh",
    width: "100vw",
  };

  const position = searchResult ? [searchResult.lat, searchResult.lon] : [51.505, -0.09];

  return (
    <div>
      {searchResult && (
        <div>
          <h2>{searchResult.display_name}</h2>
          <MapContainer center={position} zoom={17} style={mapStyles}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={position}>
              <Popup>{searchResult.display_name}</Popup>
            </Marker>
          </MapContainer>
          {searchResult.image && <img src={searchResult.image} alt={searchResult.display_name} />}
        </div>
      )}
    </div>
  );
};

export default MapView;
