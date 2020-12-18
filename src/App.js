import { useState } from "react";
import { Row, Col, Button } from "react-bootstrap";
import "./App.css";

function App() {
  const [values, setValues] = useState({
    productLink: "",
    storeId: "",
    token: "",
    price: 0
  });

  const { productLink, storeId, token, price } = values;

  const onChangeHandler = e => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value
    });
  };

  return (
    <div className="App">
      <header className="App-header">Dmart Price Tracker</header>
      <Row className="mt-5">
        <Col md={5} className="text-right">
          <h2>Product Link: </h2>
        </Col>
        <Col md={7}>
          <input
            className="w-75"
            name="productLink"
            value={productLink}
            onChange={onChangeHandler}
          />
        </Col>
      </Row>
      <Row className="mt-5">
        <Col md={5} className="text-right">
          <h2>Token: </h2>
        </Col>
        <Col md={7}>
          <textarea
            className="w-75"
            name="token"
            value={token}
            onChange={onChangeHandler}
          />
        </Col>
      </Row>
      <Row className="mt-5">
        <Col md={5} className="text-right">
          <h2>Store ID: </h2>
        </Col>
        <Col md={7}>
          <input name="storeId" value={storeId} onChange={onChangeHandler} />
        </Col>
      </Row>
      <Row className="mt-5">
        <Col md={5} className="text-right">
          <h2>Price: </h2>
        </Col>
        <Col md={7}>
          <input name="price" value={price} onChange={onChangeHandler} />
        </Col>
      </Row>
      <Row className="mt-5">
        <Col md={12} className="text-center">
          <Button className="btn-light">Submit</Button>
        </Col>
      </Row>
    </div>
  );
}

export default App;
