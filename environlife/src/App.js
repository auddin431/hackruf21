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

const MapComponent = () => {
  return <GooglePlacesAutocomplete apiKey={process.env.REACT_APP_GMAP_KEY} />;
};

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

  const testAPI = async () => {
    try {
      const r = await fetch(
        `http://192.168.1.135:5000/imagetest`
        //`http://192.168.1.135:5000/testing?location=${location}&start=${start}&end=${end}`
      );
      const response = await r.json();
      setImage1(response.image1);
      setImage2(response.image2);
      //setImage3(response.image3);
      setShow(1);
      console.log(response);
    } catch (e) {
      console.error(e);
    }
  };

  const getLatLong = async () => {
    const geoByAddy = await geocodeByAddress(location.label);
    const getLL = await getLatLng(geoByAddy[0]);
    setLatitude(getLL.lat);
    setLongitude(getLL.lng);
    setShow(1);
  };

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

  const test = () => {
    console.log(location.label);
    getLatLong();
    //testAPI();
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
                  apiKey="AIzaSyD3P3OPiWaxBOFk6metn9_GYWpGp4VuOUE"
                  style={{ position: "absolute" }}
                  selectProps={{
                    location,
                    onChange: setLocation,
                  }}
                />
                {/* <Form.Control
                  type="text"
                  placeholder="Location"
                  value={location}
                  onChange={changeLocation}
                /> */}
              </Form.Group>
            </Col>

            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Start Year</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Start Year"
                  value={start}
                  onChange={changeStart}
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
