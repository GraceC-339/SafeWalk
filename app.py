from flask import Flask, render_template,request,jsonify
import requests
import pandas as pd
import googlemaps
from haversine import haversine

app = Flask(__name__)

GOOGLE_MAPS_API_KEY = 'AIzaSyD7jrMztTqS2ikd5ojGtcUFNoQC2VbSq9A'

gmaps = googlemaps.Client(key=GOOGLE_MAPS_API_KEY)

#read the crime data
# Load crime data from CSV
def load_crime_data(csv_file):
    df = pd.read_csv(csv_file)
    return df.to_dict(orient='records')

# Load the crime data once at the start
CRIMES = load_crime_data('updated_crime_data.csv')

@app.route("/")
def map():
    return render_template("index.html", title="SafeWalk")

# fetch data from csv file and return it as json
@app.route('/data')
def data():
    df = pd.read_csv('updated_crime_data.csv')
    data = df.to_dict(orient='records')
    return {'data': data}

# Safe route recommendation

@app.route('/calculate-route', methods=['POST'])
def calculate_route():
    data = request.json
    start = data['start']
    end = data['end']
    crime_to_avoid = data['crimeToAvoid']

    #Debugging: Print input parameters
    print(f"start:{start}, End: {end}, Crime to avoid: {crime_to_avoid}")

    directions= gmaps.directions(start, end, mode='walking', alternatives=True)

    #Debugging: Print the directions
    # print(directions) - it's working

    safest_route = None
    lowest_risk = float('inf')

    for route in directions:
        risk_score = calculate_risk_score(route, crime_to_avoid, CRIMES)
        if risk_score < lowest_risk:
            lowest_risk = risk_score
            safest_route = route
    return jsonify({'route': safest_route})


def calculate_risk_score(route, crime_to_avoid, CRIMES):
    risk_score = 0
    for leg in route['legs']:
        for step in leg['steps']:
            lat = step['start_location']['lat']
            lng = step['start_location']['lng']
            for crime in CRIMES:
                if crime['CrimeType'] == crime_to_avoid:
                    crime_lat = crime['latitude']
                    crime_lng = crime['longitude']
                    distance = gmaps.distance_matrix((lat, lng), (crime_lat, crime_lng))['rows'][0]['elements'][0]['distance']['value']
                    if distance < 50:  # 500 meters radius
                        risk_score += 1
    return risk_score


if __name__ == "__main__":
    app.run(debug=True) 