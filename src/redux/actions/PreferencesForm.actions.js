// Action Types
export const RESET_PREFERENCES_FORM = 'RESET_PREFERENCES_FORM';
export const SET_MAX_PRICE_RANGE = 'SET_MAX_PRICE_RANGE';
export const SET_MEAT_PREFERENCE = 'SET_MEAT_PREFERENCE';
export const SET_RELIGIOUS_RESTRICTIONS = 'SET_RELIGIOUS_RESTRICTIONS';
export const SET_ALLERGENS = 'SET_ALLERGENS';
export const SET_CUISINE_TYPES = 'SET_CUISINE_TYPES';
export const SET_MAX_DISTANCE = 'SET_MAX_DISTANCE';
export const SET_OPEN_NOW = 'SET_OPEN_NOW';
export const SET_ACCEPTS_LARGE_PARTIES = 'SET_ACCEPTS_LARGE_PARTIES';

// Action creators
export const resetPreferencesForm = () => ({
  type: RESET_PREFERENCES_FORM,
});

export const setMaxPriceRange = (maxPriceRange) => ({
  type: SET_MAX_PRICE_RANGE,
  payload: maxPriceRange,
});

export const setMeatPreference = (meatPreference) => ({
  type: SET_MEAT_PREFERENCE,
  payload: meatPreference,
});

export const setReligiousRestrictions = (religiousRestrictions) => ({
  type: SET_RELIGIOUS_RESTRICTIONS,
  payload: religiousRestrictions,
});

export const setAllergens = (allergens) => ({
  type: SET_ALLERGENS,
  payload: allergens,
});

export const setCuisineTypes = (cuisineTypes) => ({
  type: SET_CUISINE_TYPES,
  payload: cuisineTypes,
});

export const setMaxDistance = (maxDistance) => ({
  type: SET_MAX_DISTANCE,
  payload: maxDistance,
});

export const setOpenNow = (openNow) => ({
  type: SET_OPEN_NOW,
  payload: openNow,
});

export const setAcceptsLargeParties = (acceptsLargeParties) => ({
  type: SET_ACCEPTS_LARGE_PARTIES,
  payload: acceptsLargeParties,
});