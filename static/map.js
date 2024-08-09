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
  const specificCrimeType = document.getElementById("CrimeType").value;

  // Initialise the map
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 16,
    center: { lat: 51.524215, lng: -0.039631 }, // Mile End Library
    mapId: "442e4dadd8edd99",
  });

  //Fetch the JSON crime data
  const response = await fetch("/data");
  const jsonData = await response.json();

  // Create an array to hold the markers
  const markers = [];

  // Add markers to the map
  jsonData.data.forEach((crime) => {
    // If the user has selected a specific crime type, only add markers for that crime type
    if (specificCrimeType !== "All" && crime.CrimeType !== specificCrimeType) {
      return;
    }

    const marker = new google.maps.marker.AdvancedMarkerElement({
      map,
      position: { lat: crime.latitude, lng: crime.longitude },
      title: crime.CrimeType,
    });

    // Add an info window to the marker
    const infoWindow = new google.maps.InfoWindow({
      content: `<h3>${crime.CrimeType}</h3><p>${crime.Month}</p>`,
    });

    marker.addListener("click", () => {
      infoWindow.open(map, marker);
    });

    //Add the marker to the array
    markers.push(marker);
  });

  // Initialise the markerClusterer
  new markerClusterer.MarkerClusterer({ map, markers });
}

// Function to handle user input and generate the route
async function calculateSafeRoute() {
  console.log("Calculating safe route");

  // // Load the libraries
  // const { Autocomplete } = await google.maps.importLibrary("places");

  // Get the user input from an input field or any other source
  const start = document.getElementById("start");
  const end = document.getElementById("end");
  const crimeToAvoid = document.getElementById("crimeToAvoid").value;

  // // Initialise the autocomplete
  // const autocompleteStart = new google.maps.places.Autocomplete(start);
  // const autocompleteEnd = new google.maps.places.Autocomplete(end);

  if (!start || !end) {
    alert("Please enter a start and end location");
    return;
  }

  // Initialise the map
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 16,
    center: start,
    mapId: "442e4dadd8edd99",
  });

  // Fetch the safest route based on the user's input
  const directionUrl = `/route?start=${start}&end=${end}&crimeTypeToAvoid=${crimeToAvoid}`;
  try {
    const response = await fetch(directionUrl);
    const data = await response.json();
    const directions = data.directions;
    const crimeSore = data.crime_score;

    // Render the directions on the map
    const directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);
    directionsRenderer.setDirections({ routes: [directions] });

    // Alert the user with the crime score of the safest route
    alert(`The crime score of the safest route is ${crimeSore}`);
  } catch (error) {
    console.error("Error fetching data", error);
  }
}
