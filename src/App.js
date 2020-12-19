import { useState } from "react";
import { Row, Col, Button, Spinner } from "react-bootstrap";

import "./App.css";
import { requestPrice } from "./util/api";

function App() {
  const [values, setValues] = useState({
    productLink: "",
    storeId: "",
    token: ""
  });
  const [prices, setPrices] = useState([
    {
      name: "Dummy product",
      price: "0.00"
    }
  ]);
  const [loading, setLoading] = useState(false);

  const { productLink, storeId, token } = values;

  const onChangeHandler = e => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value
    });
  };

  const submitHandler = async () => {
    setLoading(true);
    const linkSlugs = productLink.split("/");
    const length = linkSlugs.length;
    const slug = linkSlugs[length - 1];
    const data = await requestPrice({ slug, token, storeId });

    const prices = data.map(({ priceSALE: price, name }) => ({ name, price }));

    setPrices(prices);
    setLoading(false);
  };

  return (
    <div className="App">
      <header className="App-header">Dmart Price Tracker</header>
      <Row className="p-4">
        <Col md={5}>
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
      <Row className="p-4">
        <Col md={5}>
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
      <Row className="p-4">
        <Col md={5}>
          <h2>Store ID: </h2>
        </Col>
        <Col md={7}>
          <input name="storeId" value={storeId} onChange={onChangeHandler} />
        </Col>
      </Row>
      <Row>
        <Col md={12} className="text-center">
          {loading ? (
            <Spinner
              animation="grow"
              role="status"
              style={{
                color: "#7c3aed"
              }}
            />
          ) : (
            <Button className="btn-light" onClick={submitHandler}>
              Submit
            </Button>
          )}
        </Col>
      </Row>
      <Row>
        <Col md={12} className="text-center"></Col>
      </Row>
      <Row className="mt-5 text-center">
        {prices.map(({ name, price }) => (
          <Col md={12} key={price}>
            {name} has price Rs. {price}
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default App;
