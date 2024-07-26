
document.addEventListener('DOMContentLoaded', initMap);

let map;

// Function to initialise the map
async function initMap(){
  // Get the user input for specific crime type
  const specificCrimeType = document.getElementById('CrimeType').value;

  // Initialise the map
 map = new google.maps.Map(document.getElementById("map"), {
    zoom: 16,
    center: { lat: 51.524215, lng: -0.039631 }, // Mile End Library
  });
  
  //Fetch the JSON data
  const response = await fetch('/data');
  const jsonData = await response.json();

  // Create an array to hold the markers
  const markers = [];

  // Add markers to the map
  jsonData.data.forEach((crime) => {
    
    // If the user has selected a specific crime type, only add markers for that crime type
    if (specificCrimeType !== 'All' && crime.CrimeType !== specificCrimeType) {
      return;
    }

    const markerOptions = {
      position: { lat: crime.latitude, lng: crime.longitude},
      title: crime.CrimeType,
      label: {
        text: crime.CrimeType,
        color: 'black',
        fontSize: '12px',
        fontWeight: 'bold',
      },
    };

    const marker = new google.maps.Marker(markerOptions);
  
    // Add an info window to the marker
    const infoWindow = new google.maps.InfoWindow({
      content: `<h3>${crime.CrimeType}</h3><p>${crime.Month}</p>`,
    });

    marker.addListener('click', () => {
      infoWindow.open(map, marker);
    });

    //Add the marker to the array
    markers.push(marker);
    });

    // Initialise the markerClusterer
    const markerCluster = new MarkerClusterer(map, markers, {
      imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
    });

    //Add event listener for cluster clicks
    google.maps.event.addListener(markerCluster, 'clusterclick', (cluster) => {
      const markerInCluster = cluster.getMarkers();
      if (markerInCluster.length > 1) {
        map.fitBounds(cluster.getBounds());
        map.setZoom(map.getZoom() + 1);
      }else {
        const marker = markerInCluster[0];
        map.setZoom(18);
        map.setCenter(marker.getPosition());
        google.maps.event.trigger(marker, 'click');
      }
    });

}