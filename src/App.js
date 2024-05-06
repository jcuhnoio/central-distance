"use client";
/* eslint-disable no-undef */

import logo from "./logo.svg";
import "./App.css";
import {
  APIProvider,
  Map,
  useMapsLibrary,
  useMap,
} from "@vis.gl/react-google-maps";
import { useState, useEffect } from "react";

function App() {
  const position = { lat: 42.29, lng: -71.26 };

  return (
    <div className="App">
      <div style={{ height: "100vh" }}>
        <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
          <Map
            defaultCenter={position}
            defaultZoom={12}
            mapId={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
            fullscreenControl={false}
          >
            <Directions />
          </Map>
        </APIProvider>
      </div>
    </div>
  );
}

function Directions() {
  const map = useMap();
  const routesLibrary = useMapsLibrary("routes");
  const [directionsService, setDirectionsService] = useState();
  const [directionsRenderer, setDirectionsRenderer] = useState();
  const [routes, setRoutes] = useState([]);

  const origin = "Olin College of Engineering";
  const destinations = [
    "Babson College",
    "Wellesley College",
    "Music Go Round Natick",
    "Trader Joe's Needham",
  ];

  useEffect(() => {
    if (!routesLibrary || !map) return;
    setDirectionsService(new routesLibrary.DirectionsService());
    setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map }));
  }, [routesLibrary, map]);

  useEffect(() => {
    if (!directionsService || !directionsRenderer) return;
    const routesArray = [];
    for (let i = 0; i < destinations.length; i++) {
      directionsService
        .route({
          origin: origin,
          destination: destinations[i],
          travelMode: google.maps.TravelMode.DRIVING,
          provideRouteAlternatives: false,
        })
        .then((response) => {
          setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map }));
          directionsRenderer.setDirections(response);
          routesArray.push(response.routes);
        });
      setRoutes(routesArray);
    }
  }, [directionsService, directionsRenderer]);

  console.log(routes);
  return null;
}

export default App;
