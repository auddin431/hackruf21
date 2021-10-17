import "./App.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { geocodeByAddress, getLatLng } from "react-google-places-autocomplete";

import GooglePlacesAutocomplete from "react-google-places-autocomplete";

function TestComponent(props) {
  return (
    <>
      {props.text.map((im) => (
        <div className="imDivItem">
          <img
            className="imageComponent"
            src={`data:image/png;base64, ${im}`}
          />
        </div>
      ))}
      <h1>
        Latitude = {props.ello[0]} Longitude = {props.ello[1]}
      </h1>
    </>
  );
}

function App() {
  const [location, setLocation] = useState("");
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [show, setShow] = useState(0);
  const [start, setStart] = useState(2021);
  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("");
  //const [image3, setImage3] = useState("");
  const [end, setEnd] = useState(2022);

  const testAPI = async (lll) => {
    try {
      const r1 = await fetch(
        `http://172.31.2.106:5000/get_precipitation?lat=${lll.lat}&long=${lll.lng}&end=${end}`
      );
      const response1 = await r1.json();
      const r2 = await fetch(
        `http://172.31.2.106:5000/get_air_quality?lat=${lll.lat}&long=${lll.lng}&end=${end}`
      );
      const response2 = await r2.json();

      setImage1(response1.image);
      setImage2(response2.image);
      //setImage3(response.image3);
      setShow(1);
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
  return new Promise(resolve => {
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
    setStart(e.target.value);
    //console.log(e.target.value);
  };

  const changeEnd = (e) => {
    setEnd(e.target.value);
    //console.log(e.target.value);
  };

  const test = async () => {
    console.log(location.label);
    var lll = await getLatLong();
    testAPI(lll);
    //setShow(1);
  };

  return (
    <div className="App">
      <h1>Environlife</h1>
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
                text={[image1, image2]}
              />
            )}
          </div>
        </Form>
      </Container>
    </div>
  );
}

export default App;
