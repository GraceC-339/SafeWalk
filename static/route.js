// Import the Google Maps API script
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyD7jrMztTqS2ikd5ojGtcUFNoQC2VbSq9A&libraries=places"></script>

// Add an event listener to the button that triggers the generateRoute function
document.getElementById('getRouteButton').addEventListener('click', generateRoute);

// Create a function to handle user input and generate the route
function generateRoute() {
    // Get the user input from an input field or any other source
    const origin = document.getElementById('start').value;
    const destination = document.getElementById('end').value;

    // Create a DirectionsService object
    const directionsService = new google.maps.DirectionsService();

    // Create a DirectionsRenderer object to display the route on the map
    const directionsRenderer = new google.maps.DirectionsRenderer();

    // Set the map to display the route
    const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: { lat: 51.524215, lng: -0.039631 } // Set the initial map center
    });
    directionsRenderer.setMap(map);

    // Create a request object with the user input
    const request = {
        origin: origin,
        destination: destination,
        travelMode: 'WALKING' // You can change the travel mode to 'WALKING', 'BICYCLING', or 'TRANSIT'
    };

    // Call the DirectionsService route method to generate the route
    directionsService.route(request, function(result, status) {
        if (status === 'OK') {
            // Display the route on the map
            directionsRenderer.setDirections(result);
        } else {
            // Handle the error if the route cannot be generated
            alert('Error: ' + status);
        }
    });
}




