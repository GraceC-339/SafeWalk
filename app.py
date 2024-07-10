from flask import Flask, render_template
import pandas as pd

app = Flask(__name__)

@app.route("/")
def hello_world():
    return render_template("index.html", title="Hello")

@app.route('/data')
def data():
    df = pd.read_csv('updated_crime_data.csv')
    data = df.to_dict(orient='records')
    return {'data': data}