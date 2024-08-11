document.addEventListener("DOMContentLoaded", initMap);

let map;

// Function to initialise the map
async function initMap() {
  //load the libraries
  const { Map, InfoWindow } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary(
    "marker"
  );
  // Get the user input for specific crime type
  const CrimeType = document.getElementById("CrimeType").value;

  // Initialise the map
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 16,
    center: { lat: 51.524215, lng: -0.039631 }, // Mile End Library
    mapId: "906b66ac311aa5a1",
  });

  //Fetch the JSON crime data according to the user's input - crimeType

  const res = await fetch("/crimedata", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ crime_type: CrimeType }),
  });

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }

  const jsonData = await res.json();
  // console.log(jsonData);

  // Create an array to hold the markers
  const markers = [];

  // Add markers to the map for each crime
  for (let i = 0; i < jsonData.length; i++) {
    const crime = jsonData[i];
    const marker = new google.maps.marker.AdvancedMarkerElement({
      position: { lat: crime.latitude, lng: crime.longitude },
      map: map,
      title: crime.CrimeType,
    });

    markers.push(marker);
  }

  // Initialise the markerClusterer
  new markerClusterer.MarkerClusterer({ map, markers });
}

// jsonData.forEach((crime) => {
//   const marker = new google.maps.marker.AdvancedMarkerElement({
//     map,
//     position: { lat: crime.latitude, lng: crime.longitude },
//     title: crime.CrimeType,
//   });

//   //Add the marker to the array
//   markers.push(marker);
// });

// Initialise the markerClusterer
//   new markerClusterer.MarkerClusterer({ map, markers });
// }

// Function to handle user input and generate the route
async function calculateSafeRoute() {
  console.log("Calculating safe route");

  // Load the places libraries for autocomplete
  const { Autocomplete } = await google.maps.importLibrary("places");

  // Initialise the autocomplete
  const autocompleteStart = new google.maps.places.Autocomplete(
    document.getElementById("start")
  );
  const autocompleteEnd = new google.maps.places.Autocomplete(
    document.getElementById("end")
  );

  // Get the user input from an input field or any other source
  const start = document.getElementById("start").value;
  const end = document.getElementById("end").value;
  const crimeToAvoid = document.getElementById("crimeToAvoid").value;

  if (!start || !end) {
    alert("Please enter a start and end location");
    return;
  }

  // Fetch the safest route based on the user's input
  const routeResponse = await fetch("/calculate-route", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ start, end, crimeToAvoid }),
  });
  console.log("Calculating safe route, fetch the route");

  const routeData = await routeResponse.json();

  // Render the directions on the map
  const directionsRenderer = new google.maps.DirectionsRenderer();
  directionsRenderer.setMap(map);
  directionsRenderer.setDirections(routeData.route);
}
