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

## Prerequisites

- Python 3.9.x
- `pip` (Python package installer)
- Google Map API key (Use my own for final project)

## Getting Started

### Dependencies

- flask
- pandas
- googlemaps
- haversine

Please make sure to install these dependencies before running the program.

### Installing

**1. Activate the virtual environment**

```
source venv/bin/activate
```

**2. Install the dependencies first from requirements.txt**

```
pip install -r requirements.txt
```

### Running the Application

**1. Start the Application**

```
flask run
```

**2. Access the Application**
Open your web browser and go to `http://127.0.0.1:5000/`
