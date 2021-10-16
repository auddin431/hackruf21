import "./App.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";

function TestComponent(props) {
  return <h1>{props.text}</h1>;
}

function App() {
  const [location, setLocation] = useState("");
  const [show, setShow] = useState(0);
  const [start, setStart] = useState(2021);
  const [end, setEnd] = useState(2022);

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
    setShow(1);
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
          {show === 1 && <TestComponent text={location} />}
        </Form>
      </Container>
    </div>
  );
}

export default App;
