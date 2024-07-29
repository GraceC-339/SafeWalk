from flask import Flask, render_template,request,jsonify
import requests
import pandas as pd
from haversine import haversine

app = Flask(__name__)

GOOGLE_MAPS_API_KEY = 'AIzaSyD7jrMztTqS2ikd5ojGtcUFNoQC2VbSq9A'

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

@app.route('/route', methods=['GET'])
def route():
    start = request.args.get('start')
    end = request.args.get('end')
    crime_to_avoid = request.args.get('crime_to_avoid')

    # fetch routes from Google Maps Directions API
    directions_url = f'https://maps.googleapis.com/maps/api/directions/json?destination={end}&origin={start}&mode=walking&key={GOOGLE_MAPS_API_KEY}'
    directions_response = requests.get(directions_url).json()
    routes = directions_response['routes']

    safest_route = None
    lowest_crime_score = float('inf')

    # Define crime scores for each crime type
    # to be updated - take the values from user input
    crime_scores = {
        'Theft from the person': 1,
        'Anti-social behaviour': 2,
        'Violence and sexual offences': 3,
        'Robbery': 4
    }
    crime_scores_to_avoid = crime_scores.get(crime_to_avoid, 0)

    for route in routes:
        crime_count = 0
        for leg in route['legs']:
            for step in leg['steps']:
                step_lat = step['end_location']['lat']
                step_lng = step['end_location']['lng']

                # caculate crime score within proximity for each route step
                for crime in CRIMES:
                    crime_lat = crime['latitude']
                    crime_lng = crime['longitude']
                    distance = haversine(step_lat, step_lng, crime_lat, crime_lng)
                    if distance < 0.5:
                        crime_count += crime_scores.get(crime['Crime type'], 0)
        
        #Keep track of the route with the lowest crime score
        if crime_count < lowest_crime_score:
            lowest_crime_score = crime_count
            safest_route = route
    return jsonify({'directions': safest_route, 'crime_score': lowest_crime_score})



if __name__ == "__main__":
    app.run(debug=True) 