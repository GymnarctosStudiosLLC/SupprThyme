import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Button } from "@mui/material";
import { useHistory } from "react-router-dom";
import RestaurantSearch from "../RestaurantSearch/RestaurantSearch";
import RestaurantMap from "../MapPlaceholder/RestaurantMap";
import { geocodeLocation } from "../MapPlaceholder/mapUtils";

function UserHomePage() {
  const user = useSelector((store) => store.user);
  const [heading, setHeading] = useState("Find a Restaurant Near You");
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  const [aggregatePreferences, setAggregatePreferences] = useState({});
  const [center, setCenter] = useState({ lat: 0, lng: 0 });
  const [zoom, setZoom] = useState(10);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    if (!window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${
        import.meta.env.VITE_GOOGLE_MAPS_API_KEY
      }`;
      script.async = true;
      script.defer = true;
      script.onload = () => setScriptLoaded(true);
      document.body.appendChild(script);
    } else {
      setScriptLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (scriptLoaded) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const response = await axios.get(`/api/user/${user.id}`);
          const newAggregatePreferences = {
            city: response.data.city,
            state: response.data.state,
            id: user.id,
          };
          console.log('newAggregatePreferences:', newAggregatePreferences)
          setAggregatePreferences(newAggregatePreferences);
          //update the heading
          setHeading(`Find a restaurant near ${newAggregatePreferences.city}, ${newAggregatePreferences.state}`);
          console.log('aggregatePreferences from HomePage:', aggregatePreferences)
  
          // Geocode the location string
          const locationString = `${response.data.city}, ${response.data.state}`;
          const geocodedLocation = await geocodeLocation(locationString);
  
          if (geocodedLocation) {
            // Set the center state with the geocoded location
            setCenter(geocodedLocation);
          } else {
            // If geocoding failed, set the center state with the latitude and longitude from the user data
            setCenter({
              lat: response.data.latitude,
              lng: response.data.longitude,
            });
          }
          setLoading(false);
        } catch (error) {
          console.error("Error fetching user data:", error);
          setLoading(false);
        }
      };
  
      fetchData();
    }
    console.log('aggregatePreferences after fetch:', aggregatePreferences)
  }, [user.id, scriptLoaded]);

  const handleClick = () => {
    history.push("/create-group");
  };

  if (loading) {
    return <p>Loading...</p>;
  }
  return (
    <div>
      <h2>{heading}</h2>
      <RestaurantMap center={center} zoom={zoom} restaurants={restaurants} />
      {!loading && (
        <RestaurantSearch
          searchParams={aggregatePreferences}
          setRestaurants={setRestaurants}
        />
      )}{" "}
      <div>
        <Button variant="contained" color="primary" onClick={handleClick}>
          Create a group
        </Button>
      </div>
    </div>
  );
}

export default UserHomePage;
