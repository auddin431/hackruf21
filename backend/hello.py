from flask import Flask, request, jsonify, send_file
from flask_cors import CORS, cross_origin
import base64


app = Flask(__name__)
app.config['CORS_HEADERS'] = 'Content-Type'
#cors = CORS(app, resources={r"/testing": {"origins": "http://192.1.1.109:3000"}})
cors = CORS(app, resources={r"/imagetest": {"origins": "http://192.1.1.109:3000"}})


@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"


@app.route("/testing", methods=['GET'])
@cross_origin(origin='192.1.1.109',headers=['Content- Type','Authorization'])
def testing_get():
    location = request.args.get('location')
    print(location)
    d = {"received": location}
    return jsonify(d)


@app.route("/imagetest", methods=['GET'])
@cross_origin(origin='192.1.1.109',headers=['Content- Type','Authorization'])
def testing_send():
    with open("EO_4PyQWsAAa6Gq.png", "rb") as img_file:
        my_string = str(base64.b64encode(img_file.read()))
        my_string = my_string[2:len(my_string)-1]

    with open("Untitled.png", "rb") as img_file2:
        my_string2 = str(base64.b64encode(img_file2.read()))
        my_string2 = my_string2[2:len(my_string2)-1]

    returnthing = {"image1": my_string, "image2": my_string2}

    return jsonify(returnthing)

