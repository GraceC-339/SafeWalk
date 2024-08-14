# SafeWalk: Personalised Safe Route Recommendation App

**SafeWalk** is a web application designed to provide pedestrians with safe route recommendations based on their preferences on the crime type they want to avoid. The app integrates with Google Maps API to display an interactive crime map and calculate the safest route between two locations, considering user-specified crime risks.
The current crime data was in Tower Hamlets, London, gathered from police.uk.

## Features

**1. Interactive Crime Map**

Integration with Google Maps API and a crime dataset.
Users can filter and display different types of crimes on the map.

**2. Safe Route Recommendation**

Users input start and end locations.
According to the crime type they want to avoid, the system generates multiple routes using Google Maps Directions API, calculates the crime risk for each, and recommends the safest route with the risk score.

## Getting Started

### Dependencies

- Describe any prerequisites, libraries, OS version, etc., needed before installing program.
- ex. Windows 10
- Python
- Flask
- pandas
- googlemaps

### Dependencies

- Google Maps JavaScript API
- Google Maps Directions API
- Google Maps Geocoding API
- Bootstrap
- CSS
- HTML
- JavaScript

Please make sure to install these dependencies before running the program.

### Installing

- How/where to download your program
- Any modifications needed to be made to files/folders

### Executing program

- How to run the program

```
flask run
```

- Step-by-step bullets

## Acknowledgments

Inspiration, code snippets, etc.

- [awesome-readme](https://github.com/matiassingers/awesome-readme)
- [PurpleBooth](https://gist.github.com/PurpleBooth/109311bb0361f32d87a2)
- [dbader](https://github.com/dbader/readme-template)
- [zenorocha](https://gist.github.com/zenorocha/4526327)
- [fvcproductions](https://gist.github.com/fvcproductions/1bfc2d4aecb01a834b46)
