import { useState, useMemo, useEffect } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import "@reach/combobox/styles.css";
import { useDispatch } from "react-redux";
import { setAddress } from "../../redux/user-slice";


export default function Places({ dataToComponent }) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
    componentRestrictions: {
      country: 'NG'
    }
  });

  const handleRecievedData = (data) => {
    if (dataToComponent) {
      dataToComponent(data)
    }
  }

  if (!isLoaded) return <div>Loading...</div>;
  return <Map dataToplaces={handleRecievedData}/>;
}

function Map({dataToplaces}) {
  const center = useMemo(() => ({ lat: parseFloat(43.45), lng: parseFloat(-80.49) }), []);
  const [selected, setSelected] = useState(undefined); 
  const dispatch = useDispatch();
  useEffect(() => {
    if (selected) {
      dataToplaces(selected)
      dispatch(setAddress(selected))
    }
  }, [selected])
  return (
    <>
      <div className="places-container">
        <PlacesAutocomplete setSelected={setSelected} />
      </div>

      <GoogleMap
        zoom={10}
        center={center}
        mapContainerClassName="map-container"
      >
        {selected && <Marker position={selected} />}
      </GoogleMap>
    </>
  );
}

const PlacesAutocomplete = ({ setSelected }) => {
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete();

  const handleSelect = async (address) => {
    setValue(address, false);
    clearSuggestions();
    const results = await getGeocode({ address });
    const address_components = results[0].address_components;
    const localGovt = address_components[3]?.long_name
    const state = address_components[4]?.long_name
    let countryData = address_components.find((res)=> { return (res.types).includes('country', 'political') });
    const { long_name, short_name } = countryData;
    const latLng = getLatLng(results[0]);
    const {lat, lng } = latLng;

    const formAddress = {
      country: long_name,
      fullAddress: address,
      localGovt,
      state,
      countryCode: short_name,
      latitude: lat,
      longitude:lng,
      userTypedAddress: value
    };

    setSelected(formAddress);
  };

  return (
    <Combobox onSelect={handleSelect}>
      <ComboboxInput
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={!ready}
        className="combobox-input"
        placeholder="Search an address"
      />
      <ComboboxPopover>
        <ComboboxList>
          {status === "OK" &&
            data.map(({ place_id, description }) => (
              <ComboboxOption key={place_id} value={description} />
            ))}
        </ComboboxList>
      </ComboboxPopover>
    </Combobox>
  );
};
