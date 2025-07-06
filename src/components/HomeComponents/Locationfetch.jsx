import React, { useEffect, useState } from 'react';

function LocationFetcher() {
  const [location, setLocation] = useState({ lat: null, lon: null });
  const [address, setAddress] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lon: longitude });

          // Reverse geocoding call to Nominatim
          fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          )
            .then((res) => res.json())
            .then((data) => {
              const addr = data.address;
              setAddress({
                city: addr.city || addr.town || addr.village,
                postcode: addr.postcode,
                state: addr.state,
                country: addr.country,
              });
            })
            .catch(() => {
              setError('Failed to get address');
            });
        },
        (err) => {
          setError(err.message);
        }
      );
    }
  }, []);

  return (
    <div className="">
      {/* <h2 className="text-xl font-semibold mb-2">User Location</h2> */}
      {error && <p className="text-red-500">{error}</p>}

      {/* {location.lat && location.lon && (
        <p>
          <strong>Latitude:</strong> {location.lat}, <strong>Longitude:</strong>{' '}
          {location.lon}
        </p>
      )} */}

      {address && (
        <p className="flex justify-evenly items-center gap-2" >
           <p>{address.city} </p>
          <p>{address.postcode} </p> 
          {/* <strong>State:</strong> {address.state} <br />
          <strong>Country:</strong> {address.country} */}
        </p>
      )}
    </div>
  );
}

export default LocationFetcher;
