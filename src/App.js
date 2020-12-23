import { useState } from "react";
import { Row, Col, Button, Spinner, ListGroup } from "react-bootstrap";
import { writeStorage, useLocalStorage } from "@rehooks/local-storage";

import "./App.css";
import { requestPrice } from "./util/api";

const capitalize = string => {
  return string[0].toUpperCase() + string.slice(1).toLowerCase();
};

function App() {
  const [localList] = useLocalStorage("list");
  const [values, setValues] = useState({
    storeId: "",
    token: ""
  });
  const [listItem, setListItem] = useState("");
  const [list, setList] = useState(localList || []);

  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(false);

  const { storeId, token } = values;

  const onChangeHandler = e => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value
    });
  };

  const addHandler = () => {
    const slug = listItem.split("/")[listItem.split("/").length - 1];
    const nameList = slug.split("-");

    const name = nameList.reduce(
      (acc, curr) => acc + " " + capitalize(curr),
      ""
    );

    const newList = [
      ...list,
      {
        name,
        slug
      }
    ];
    setList(newList);
    writeStorage("list", newList);
    setListItem("");
  };

  const submitHandler = async () => {
    try {
      setLoading(true);
      const data = await requestPrice({ list, token, storeId });
      setPrices(data);
    } catch (err) {
      alert("Something went wrong! Try after sometime.");
    }
    setLoading(false);
  };

  return (
    <div className="App">
      <header className="App-header">Dmart Price Tracker</header>
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
      <Row className="p-4 mx-auto">
        <Col md={6}>
          <h2>Product Link: </h2>
          <input
            className="w-100"
            name="listItem"
            value={listItem}
            onChange={e => setListItem(e.target.value)}
          />
          <Button className="btn-light mt-4" onClick={addHandler}>
            Add
          </Button>
        </Col>
      </Row>
      <Row className="p-4 mx-auto">
        <Col md={12}>
          <ListGroup className="">
            {list.map(({ name, slug }) => (
              <ListGroup.Item key={slug}>
                {name}
                {Object.keys(prices).length && prices[slug] ? (
                  prices[slug].map(priceArr => (
                    <div>
                      {priceArr.name} has price {priceArr.price}
                    </div>
                  ))
                ) : (
                  <div />
                )}
              </ListGroup.Item>
            ))}
          </ListGroup>
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
    </div>
  );
}

export default App;
