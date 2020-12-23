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
  const [listItem, setListItem] = useState("");
  const [list, setList] = useState(localList || []);

  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(false);

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
      const data = await requestPrice({ list });
      setPrices(data);
    } catch (err) {
      alert("Something went wrong! Try after sometime.");
    }
    setLoading(false);
  };

  console.log(prices);

  const pinCodes = Object.keys(prices);

  return (
    <div className="App">
      <header className="App-header">Dmart Price Tracker</header>
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
              <ListGroup.Item key={slug}>{name}</ListGroup.Item>
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
      {pinCodes.length ? (
        pinCodes.map(pin => (
          <Row className="p-4 mx-auto">
            <Col md={12}>
              <strong>PIN: {pin}</strong>
              {Object.values(prices[pin]).map((productsArr, index) => (
                <ListGroup key={pin + index}>
                  <ListGroup.Item key={pin + index}>
                    {productsArr.map(product => {
                      return (
                        <div>
                          {product.name} has price {product.price}
                        </div>
                      );
                    })}
                  </ListGroup.Item>
                </ListGroup>
              ))}
            </Col>
          </Row>
        ))
      ) : (
        <div />
      )}
    </div>
  );
}

export default App;
