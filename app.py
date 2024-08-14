from flask import Flask, render_template,request,jsonify
import pandas as pd
import googlemaps
from haversine import haversine

app = Flask(__name__)

GOOGLE_MAPS_API_KEY = 'AIzaSyBvVLjWmCja331H8SuIZ4UlJdZytuYkC6Y'

gmaps = googlemaps.Client(key=GOOGLE_MAPS_API_KEY)

#read the crime data
# Load crime data from CSV
def load_crime_data(csv_file):
    df = pd.read_csv(csv_file)
    return df.to_dict(orient='records')

# Load the crime data once at the start
CRIMES = load_crime_data('crimedata.csv')

#Render the html page
@app.route("/")
def map():
    return render_template("index.html", title="SafeWalk")

#Filter data based on crime type
@app.route('/crimedata', methods=['GET'])
def filter_crime_data():
    try:
        crime_type = request.args.get('crime_type')

        #Validation
        if not crime_type:
            return jsonify({"error":"missing crime_type field"}),400
        
        df=pd.read_csv('crimedata.csv')
        if crime_type != 'All':
            filtered_df = df[df['CrimeType']==crime_type]
        else:
            filtered_df = df
        result = filtered_df.to_dict(orient="records")
        return jsonify(result)
    
    except Exception as e:
        return jsonify({"error":str(e)}),500

# Safe route calculation
@app.route('/calculate-route', methods=['GET'])
def calculate_route():
    try:
        start = request.args.get('start')
        end = request.args.get('end')
        crime_to_avoid = request.args.get('crime_to_avoid')

        #Validation
        if not start or not end or not crime_to_avoid:
            return jsonify({'error': 'Missing input parameters'})

        #Debugging: Print input parameters
        print(f"start:{start}, End: {end}, Crime to avoid: {crime_to_avoid}")

        #Get the directions from Google Maps API
        directions= gmaps.directions(start, end, mode='walking', alternatives=True)
        #Directions is a list of routes
        #Each route has legs (A list of dictionaries, where each dictionary represents a leg of the journey.
        #which has steps (represents a segment of the journey.)
        #Each step has start_location and end_location (latitude and longitude)
        #We will calculate the risk score based on the distance between the start_location of each step and the crime location in calculate_risk_score function

        #Debugging: Print the directions
        # print(directions) - it's working

        safest_route = None
        lowest_risk = float('inf')

        for route in directions:
            risk_score = calculate_risk_score(route, crime_to_avoid)
            if risk_score < lowest_risk:
                lowest_risk = risk_score
                safest_route = route
        
        # print(f"Safest Route: {safest_route}, Lowest Risk: {lowest_risk}")
        return jsonify({'route': safest_route, 'risk': lowest_risk})
    
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': str(e)})


def calculate_risk_score(route, crime_to_avoid):
    """ Calculate the risk score for a given route based on the crime data
      """
    risk_score = 0
    for leg in route['legs']:
        for step in leg['steps']:
            lat_start = step['start_location']['lat']
            lng_start = step['start_location']['lng']

            for crime in [crime for crime in CRIMES if crime['CrimeType'] == crime_to_avoid]:
                crime_lat = crime['latitude']
                crime_lng = crime['longitude']
                distance = haversine((lat_start, lng_start), (crime_lat, crime_lng))
                ## haversine formula in python - distance in km
                ## We consider the risk score as 1 if the distance is less than 100 meters
                if distance < 0.1:
                    risk_score += 1
    print(f"The Risk of coming across {crime_to_avoid} for the routes: {risk_score}")
    return risk_score


if __name__ == "__main__":
    app.run(debug=True) 