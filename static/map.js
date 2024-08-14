document.addEventListener("DOMContentLoaded", initMap);

let map;
let polyline;
let startMarker;
let endMarker;

/////////// Function to initialise the interactive crime map////////////////////
async function initMap() {
  //load the libraries
  const { Map, InfoWindow } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary(
    "marker"
  );
  const { Autocomplete } = await google.maps.importLibrary("places");

  // Initialise the autocomplete for the start and end locations
  const autocompleteStart = new google.maps.places.Autocomplete(
    document.getElementById("start")
  );
  const autocompleteEnd = new google.maps.places.Autocomplete(
    document.getElementById("end")
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
  const res = await fetch(
    `/crimedata?crime_type=${encodeURIComponent(CrimeType)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // body: JSON.stringify({ crime_type: CrimeType }),
    }
  );
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  const jsonData = await res.json();

  // Create an array to hold the markers
  const markers = [];

  //Check if crime jsonData is an array and convert it to an array if it is an object
  let crimesArray = [];
  if (typeof jsonData === "object" && !Array.isArray(jsonData)) {
    crimesArray = Object.values(jsonData);
  } else if (Array.isArray(jsonData)) {
    crimesArray = jsonData;
  } else {
    console.error("Expected an array or object, got something else");
    throw new Error("Expected an array or object, got something else");
  }

  crimesArray.forEach((crime) => {
    const marker = new google.maps.marker.AdvancedMarkerElement({
      map,
      position: { lat: crime.latitude, lng: crime.longitude },
      title: crime.CrimeType,
    });

    //Add the marker to the array
    markers.push(marker);
  });

  //Initialise the markerClusterer
  new markerClusterer.MarkerClusterer({ map, markers });
}

//////////////////////////////////////////////////////////////////////////////////////////////
///////////// Function to handle user input and generate the safest route/////////////////////
async function calculateSafeRoute() {
  console.log("Start calculating safe route");

  // Get the user input from an input field or any other source
  const start = document.getElementById("start").value;
  const end = document.getElementById("end").value;
  const crimeType = document.getElementById("CrimeType").value;

  // Validation - Check if the user has entered a start and end location
  if (!start || !end) {
    alert("Please enter a start and end location");
    return;
  }

  // Fetch the safest route based on the user's input
  const routeResponse = await fetch(
    `/calculate-route?start=${encodeURIComponent(
      start
    )}&end=${encodeURIComponent(end)}&crime_to_avoid=${encodeURIComponent(
      crimeType
    )}}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // body: JSON.stringify({ start, end, crimeToAvoid }),
    }
  );
  console.log("Calculating safe route- fetched the route data");

  const routeData = await routeResponse.json();

  // Check if the route is valid
  if (routeData.error) {
    alert(routeData.error);
    return;
  }

  //Debugging: Print the route data
  console.log(routeData);
  // routeData contains the directions(route) and the risk score (risk)

  // get the route directions from the routeData
  directions = routeData.route;

  // Debugging - check the type of the directions
  console.log("Directions: ", directions);
  console.log("Directions type: ", typeof directions);
  console.log("Directions.legs type: ", typeof directions.legs);

  //Clear the previous route and markers
  clearRoute();
  clearMarkers(startMarker, endMarker);
  // Display the route on the map
  displayRoutesWithPolylines(directions);

  // Display the risk score
  alert(`The risk score of "${crimeType}" for the route is: ${routeData.risk}`);
}

// Display the route using polylines
function displayRoutesWithPolylines(route) {
  console.log("Displaying route with polylines-running");

  if (!route || !route.legs) {
    console.error("Invalid route data");
    return;
  }

  const polylinecoords = [];

  for (leg of route.legs) {
    for (step of leg.steps) {
      lat = step.end_location.lat;
      lng = step.end_location.lng;
      polylinecoords.push({ lat, lng });
    }
  }

  // Debugging - check the polyline coordinates
  console.log("Polyline Coords: ", polylinecoords);

  polyline = new google.maps.Polyline({
    path: polylinecoords,
    geodesic: true,
    strokeColor: "#26BD50",
    strokeOpacity: 2,
    strokeWeight: 8,
  });

  //Set the map center to the start location
  map.setCenter({ lat: polylinecoords[0].lat, lng: polylinecoords[0].lng });

  //Set the map bounds to include the entire route
  const bounds = new google.maps.LatLngBounds();
  polylinecoords.forEach((coord) => bounds.extend(coord));
  map.fitBounds(bounds);

  // Add markers for the start and end locations
  startMarker = new google.maps.Marker({
    position: polylinecoords[0],
    map: map,
    title: "Start",
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: "#26BD50",
      fillOpacity: 1,
      strokeColor: "#ffffff",
      strokeOpacity: 1,
      strokeWeight: 2,
      scale: 10,
    },
  });

  endMarker = new google.maps.Marker({
    position: polylinecoords[polylinecoords.length - 1],
    map: map,
    title: "End",
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: "#26BD50",
      fillOpacity: 1,
      strokeColor: "#ffffff",
      strokeOpacity: 1,
      strokeWeight: 2,
      scale: 10,
    },
  });

  polyline.setMap(map);
}
// Clear the previous route
function clearRoute() {
  if (polyline) {
    polyline.setMap(null);
  }
}

//Clear the previous start and end markers
function clearMarkers(startMarker, endMarker) {
  if (startMarker) {
    startMarker.setMap(null);
  }
  if (endMarker) {
    endMarker.setMap(null);
  }
}
