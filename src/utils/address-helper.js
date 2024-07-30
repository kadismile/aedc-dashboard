import {
  setKey,
  setDefaults,
  setLanguage,
  setRegion,
  fromAddress,
  fromLatLng,
  fromPlaceId,
  setLocationType,
  geocode,
  RequestType,
} from "react-geocode";

export const prepareAddresss = (address) => {
  setDefaults({
    key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY, // Your API key here.
    language: "en", // Default language for responses.
    region: "es", // Default region for responses.
  });
  return fromAddress(address)
  .then(({ results }) => {
    const { lat, lng } = results[0].geometry.location;
    return {
      longitude: lng,
      latitude: lat,
      countryCode: 'NG',
      fullAddress: results[0].formatted_address,
      country: 'Nigeria'
    }
  })
  .catch(console.error)
}
