import "./App.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";

function TestComponent(props) {
  return (
    <img
      style={{ maxWidth: "50%", maxHeight: "50%" }}
      src={`data:image/png;base64, ${props.text}`}
    />
  );
}

function App() {
  const [location, setLocation] = useState("");
  const [show, setShow] = useState(0);
  const [start, setStart] = useState(2021);
  const [image, setImage] = useState("");
  const [end, setEnd] = useState(2022);

  const testAPI = async () => {
    try {
      const r = await fetch(
        `http://192.168.1.135:5000/imagetest`
        //`http://192.168.1.135:5000/testing?location=${location}&start=${start}&end=${end}`
      );
      const response = await r.json();
      setImage(response.picture);
      setShow(1);
      console.log(response);
    } catch (e) {
      console.error(e);
    }
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
    console.log(location);
    testAPI();
    //s/etShow(1);
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
                <Form.Control
                  type="text"
                  placeholder="Location"
                  value={location}
                  onChange={changeLocation}
                />
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
          <Button variant="success" onClick={test}>
            Get Environment Stats
          </Button>
          <Row>{show === 1 && <TestComponent text={image} />}</Row>
        </Form>
      </Container>
    </div>
  );
}

export default App;
