import React, { useEffect, useState } from "react";
import LogOutButton from "../LogOutButton/LogOutButton";
import { useSelector } from "react-redux";
import { Button } from "@mui/material";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { response } from "express";

function UserPage() {
  const user = useSelector((store) => store.user);
  const history = useHistory();
  const [userPrefSummary, setUserPrefSummary] = useState([]);
  const [userAddress, setUserAddress] = useState([]);

  const updatePrefs = () => {
    history.push("/preferences");
  };

  const updateAcctInfo = () => {
    alert(
      "This functionality has not been implemented yet. Please stay tuned for updates!"
    );
  };

  const getPrefInfo = async () => {
    axios
      .get(`/api/user_preferences/${user.id}`)
      .then((response) => {
        setUserPrefSummary(response.data);
      })
      .catch((error) => {
        console.error("Error Fetching user preferences", error);
      });
  };

  const getAddressInfo = async () => {
    axios
      .get(`/api/user/address/${user.id}`)
      .then((response) => {
        setUserAddress(response.data);
      })
      .catch((error) => {
        console.error("Error fetching Address Information:", error);
      });
  };

  useEffect(() => {
    if (user.id) {
      getPrefInfo();
      getAddressInfo();
    }
  }, [user.id]);
  return (
    <div className="container">
      <h2>Welcome, {user.username}!</h2>
      <h3>Account Information</h3>
      <p>Your ID is: {user.id}</p>
      <p>Email: {user.email}</p>
      <p>Street Address:{userAddress.street1}</p>
      <p>Apt, Suite, Building Number, etc: {userAddress.street2}</p>
      <p>City: {userAddress.city}</p>
      <p>State: {userAddress.state}</p>
      <p>Postal Code:{userAddress.zip}</p>
      <p>Country: {userAddress.country}</p>
      <Button variant="contained" color="primary" onClick={updateAcctInfo}>
        Update Account Information
      </Button>
      <h3>Preferences Summary</h3>
      {userPrefSummary && Object.keys(userPrefSummary).length > 0 && (
        <div>
          {console.log(userPrefSummary)}
          <p>Max Price Range: {userPrefSummary?.max_price_range}</p>
          <p>Meat Preference: {userPrefSummary?.meat_preference}</p>
          <p>
            Religious Restrictions: {userPrefSummary?.religious_restrictions}
          </p>
          <p>Cuisine Types: {userPrefSummary?.cuisine_types?.join(", ")}</p>
          <p>Max Distance: {userPrefSummary?.max_distance}</p>
          <p>Open Now: {userPrefSummary?.open_now ? "Yes" : "No"}</p>
          <p>
            Accepts Large Parties:{" "}
            {userPrefSummary?.accepts_large_parties ? "Yes" : "No"}
          </p>
          <p>Allergens:</p>
          <ul>
            {userPrefSummary?.allergens.map((allergen) => (
              <li key={allergen?.id}>{allergen?.allergen}</li>
            ))}
          </ul>
        </div>
      )}
      <Button variant="contained" color="primary" onClick={updatePrefs}>
        Update Preferences
      </Button>
      <LogOutButton className="btn" />
    </div>
  );
}

// this allows us to use <App /> in index.js
export default UserPage;
