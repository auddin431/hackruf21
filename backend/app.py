from flask import Flask, request, jsonify, send_file
from flask_cors import CORS, cross_origin
import base64
import warnings
warnings.filterwarnings("ignore")
import ee
import datetime
from dateutil import relativedelta
import time
import itertools
import numpy as np
import matplotlib.pyplot as plt
import statsmodels.api as sm
plt.style.use('fivethirtyeight')
import matplotlib
import matplotlib.dates as mdates
from pylab import rcParams
import pandas as pd
import io
import sys
import random
import os

def get_time_series(dataset_name, band, latLng, func=lambda x : x):
    coord = ee.Geometry.Point(latLng)
    dataset = ee.ImageCollection(dataset_name).select(band).filterBounds(coord)

    data = dataset.map(lambda feature : ee.Feature(coord, feature.reduceRegion(**{
            "reducer": ee.Reducer.mean(),
            "geometry": coord,
            "scale": .1
        })))
    datesset = dataset.map(lambda feature : ee.Feature(coord, {"date": feature.get("system:time_start")}))

    features = data.getInfo()["features"]
    dates = datesset.getInfo()["features"]

    ys = []
    xs = []
    for x in range(0, len(features)):
        ys.append(func(float(features[x]["properties"][band])))
        xs.append(int(dates[x]["properties"]["date"]))

    return pd.Series(ys, pd.to_datetime(xs, unit="ms"))

def make_graph(series, startyear, endyear, title, image_name):    
    p = d = q = range(0, 2)

    mi = float('inf')
    param_mi = (1, 1, 1) 
    param_seasonal_mi = (1, 1, 0, 12)
    p = d = q = range(0, 2)
    pdq = list(itertools.product(p, d, q))
    pdq = random.choices(pdq, k=2)
    seasonal_pdq_tot = [(x[0], x[1], x[2], 12) for x in list(itertools.product(p, d, q))]
    for param in pdq:
        seasonal_pdq = random.choices(seasonal_pdq_tot, k=2)
        for param_seasonal in seasonal_pdq_tot:
            try:
                mod = sm.tsa.statespace.SARIMAX(series,
                                                order=param,
                                                seasonal_order=param_seasonal,
                                                enforce_stationarity=False,
                                                enforce_invertibility=False)
                
                results = mod.fit()
                if(results.aic < mi):
                    mi = results.aic
                    param_mi = param
                    param_seasonal_mi = param_seasonal
            except:
                continue
    mod = sm.tsa.statespace.SARIMAX(series,
                                order=param_mi,
                                seasonal_order=param_seasonal_mi,
                                enforce_stationarity=False,
                                enforce_invertibility=False)
    results = mod.fit()

    pred = results.get_prediction(start="2020-07-01", dynamic=False)
    pred_ci = pred.conf_int()

    pred_uc = results.get_forecast(steps=12*(endyear-2020))
    pred_ci = pred_uc.conf_int()

    ax = series[str(startyear):].plot(label='observed', figsize=(14, 7))
    pred_uc.predicted_mean.plot(ax=ax, label='Forecast')
    print(pred_ci.iloc[:, 1])
    ax.fill_between(pred_ci.index.values.astype('datetime64[D]'),
                    pred_ci.iloc[:, 0],
                    pred_ci.iloc[:, 1], color='k', alpha=.25)
    ax.set_xlabel('Date')
    ax.set_ylabel(title)

    plt.legend()
    plt.savefig(image_name)
    plt.figure().clear()
    print(mi)


app = Flask(__name__)
app.config['CORS_HEADERS'] = 'Content-Type'
#cors = CORS(app, resources={r"/testing": {"origins": "http://192.168.1.109:3000"}})
cors = CORS(app, resources={r"/get_precipitation": {"origins": "http://192.168.1.109:3000"}, r"/get_temperature": {"origins": "http://192.168.1.109:3000"}})


ee.Initialize()

rcParams['figure.figsize'] = 18, 8

matplotlib.rcParams['axes.labelsize'] = 14
matplotlib.rcParams['xtick.labelsize'] = 12
matplotlib.rcParams['ytick.labelsize'] = 12
matplotlib.rcParams['text.color'] = 'k'
matplotlib.use('agg')


@app.route("/get_precipitation", methods=['GET'])
@cross_origin(origin='192.168.1.109',headers=['Content- Type','Authorization'])
def get_precipitation():
    series = get_time_series("ECMWF/ERA5/MONTHLY", "total_precipitation", [float(request.args.get("long")), float(request.args.get("lat"))])

    make_graph(series, 2000, int(request.args.get("end")), "precipitation (m)", "precipitation.png")

    with open("precipitation.png", "rb") as img_file:
        my_string = str(base64.b64encode(img_file.read()))
        my_string = my_string[2:len(my_string)-1]

    os.remove("precipitation.png")

    returnthing = {"image": my_string}

    return jsonify(returnthing)


def kelvin_to_fahrenheit(k):
    return (k-273.15) * 9 / 5.0 + 32

@app.route("/get_temperature", methods=['GET'])
@cross_origin(origin='192.168.1.109',headers=['Content- Type','Authorization'])
def get_temperature():
    series = get_time_series("ECMWF/ERA5/MONTHLY", "mean_2m_air_temperature", [float(request.args.get("long")), float(request.args.get("lat"))], kelvin_to_fahrenheit)

    make_graph(series, 2000, int(request.args.get("end")), "Temperature (F)", "temperature.png")

    with open("temperature.png", "rb") as img_file:
        my_string = str(base64.b64encode(img_file.read()))
        my_string = my_string[2:len(my_string)-1]

    returnthing = {"image": my_string}
    os.remove("temperature.png")

    return jsonify(returnthing)

@app.route("/get_air_quality", methods=['GET'])
@cross_origin(origin='192.168.1.109',headers=['Content- Type','Authorization'])
def get_air_quality():
    series = get_time_series("ECMWF/ERA5/MONTHLY", "v_component_of_wind_10m", [float(request.args.get("lat")), float(request.args.get("long"))])

    make_graph(series, 2018, int(request.args.get("end")), "air quality (mol/m^2)", "air_quality.png")

    with open("air_quality.png", "rb") as img_file:
        my_string = str(base64.b64encode(img_file.read()))
        my_string = my_string[2:len(my_string)-1]

    returnthing = {"image": my_string}
    os.remove("air_quality.png")

    return jsonify(returnthing)



@app.route("/get_sea_coverage", methods=['GET'])
@cross_origin(origin='192.168.1.109',headers=['Content- Type','Authorization'])
def get_sea_coverage():
    series = get_time_series("ECMWF/ERA5/MONTHLY", "surface_pressure", [float(request.args.get("lat")), float(request.args.get("long"))])

    make_graph(series, 2018, int(request.args.get("end")), "Sea Coverage", "sea_coverage.png")

    with open("sea_coverage.png", "rb") as img_file:
        my_string = str(base64.b64encode(img_file.read()))
        my_string = my_string[2:len(my_string)-1]

    returnthing = {"image": my_string}
    os.remove("sea_coverage.png")

    return jsonify(returnthing)
