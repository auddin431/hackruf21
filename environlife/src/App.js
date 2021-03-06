import "./App.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { geocodeByAddress, getLatLng } from "react-google-places-autocomplete";
//import ReactLoading from "react-loading";
import earth from "./earth-spinning.gif";
import logo from "./Design Files/EnviroLife-logos/environ-logo.png";

import GooglePlacesAutocomplete from "react-google-places-autocomplete";

function TestComponent(props) {
  return (
    <>
      {props.loading ? (
        <img src={earth} />
      ) : (
        props.text.map((im) => (
          <div className="imDivItem">
            <h2>{im.section}</h2>
            <img
              className="imageComponent"
              src={`data:image/png;base64, ${im.txt}`}
            />
          </div>
        ))
      )}
    </>
  );
}

function App() {
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [show, setShow] = useState(0);
  //const [start, setStart] = useState(2021);
  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("");
  const [image3, setImage3] = useState("");
  const [image4, setImage4] = useState("");
  const [end, setEnd] = useState(2022);

  const testAPI = async (lll) => {
    try {
      const r1 = await fetch(
        `http://192.168.1.105:5000/get_temperature?lat=${lll.lat}&long=${lll.lng}&end=${end}`
      );
      const response1 = await r1.json();

      const r2 = await fetch(
        `http://192.168.1.105:5000/get_precipitation?lat=${lll.lat}&long=${lll.lng}&end=${end}`
      );
      const response2 = await r2.json();

      const r3 = await fetch(
        `http://192.168.1.105:5000/get_sea_coverage?lat=${lll.lat}&long=${lll.lng}&end=${end}`
      );
      const response3 = await r3.json();

      const r4 = await fetch(
        `http://192.168.1.105:5000/get_air_quality?lat=${lll.lat}&long=${lll.lng}&end=${end}`
      );
      const response4 = await r4.json();

      setImage1(response1.image);
      setImage2(response2.image);
      setImage3(response3.image);
      setImage4(response4.image);
      setLoading(false);
      //setShow(1);
      console.log(response1);
    } catch (e) {
      console.error(e);
    }
  };

  const getLatLong = async () => {
    const geoByAddy = await geocodeByAddress(location.label);
    const getLL = await getLatLng(geoByAddy[0]);
    setLatitude(getLL.lat);
    setLongitude(getLL.lng);
    return getLL;
  };

  function resolveAfter2Seconds(x) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(x);
      }, 2000);
    });
  }

  const changeLocation = (e) => {
    setLocation(e.target.value);
    //console.log(e.target.value);
  };

  const changeStart = (e) => {
    //setStart(e.target.value);
    //console.log(e.target.value);
  };

  const changeEnd = (e) => {
    setEnd(e.target.value);
    //console.log(e.target.value);
  };

  const test = async () => {
    console.log(location.label);
    setShow(1);
    setLoading(true);
    const lll = await getLatLong();
    testAPI(lll);
    //setShow(1);
  };

  return (
    <div className="App">
      <img style={{ maxWidth: "10%", paddingTop: "10px" }} src={logo} />
      <Container>
        <Form>
          <Row>
            <Col xs={6}>
              <Form.Group className="mb-3">
                <Form.Label>Location</Form.Label>
                <GooglePlacesAutocomplete
                  apiKey={process.env.REACT_APP_GMAP_KEY}
                  style={{ position: "absolute" }}
                  selectProps={{
                    location,
                    onChange: setLocation,
                  }}
                />
              </Form.Group>
            </Col>

            <Col>
              <Form.Group className="mb-3">
                <Form.Label>End Year</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="End Year"
                  value={end}
                  onChange={changeEnd}
                />
              </Form.Group>
            </Col>
          </Row>
          <div>
            <Button variant="success" onClick={test}>
              Get Environment Stats
            </Button>
          </div>
          <div className="imDiv">
            {show === 1 && (
              <TestComponent
                ello={[latitude, longitude]}
                text={[
                  { section: "Temperature", txt: image1 },
                  { section: "Precipitation", txt: image2 },
                  { section: "Sea Coverage", txt: image3 },
                  { section: "Air Quality", txt: image4 },
                ]}
                loading={loading}
              />
            )}
          </div>
        </Form>
      </Container>
    </div>
  );
}

export default App;
