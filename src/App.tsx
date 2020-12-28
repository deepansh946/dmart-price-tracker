import { useState, FormEvent } from "react";
import { Row, Col, Button, Spinner, ListGroup } from "react-bootstrap";
import { writeStorage, useLocalStorage } from "@rehooks/local-storage";

import "./App.css";
import { requestPrice } from "./util/api";
import { PriceItem, PriceArr, ListItem } from "./types";

const capitalize = (string: any) => {
  return string[0].toUpperCase() + string.slice(1).toLowerCase();
};

const DEFAULT_PRICES = {
  400029: {
    "Dummy product": [
      {
        name: "Test Product - 16 Pieces : 200 gms",
        price: "460.00",
      },
    ],
  },
};

const DEFAULT_LIST = [
  {
    name: "Dummy Product",
    slug: "dummy-product",
  },
];

const App = (): JSX.Element => {
  const [localList] = useLocalStorage<ListItem[]>("list", DEFAULT_LIST);
  const [listItem, setListItem] = useState<string>("");
  const [list, setList] = useState<ListItem[]>(localList);

  const [prices, setPrices] = useState<PriceArr>(DEFAULT_PRICES);
  const [loading, setLoading] = useState<boolean>(false);

  const addHandler: () => void = () => {
    const slug = listItem.split("/")[listItem.split("/").length - 1];
    const nameList = slug.split("-");

    const name = nameList.reduce(
      (acc, curr) => acc + " " + capitalize(curr),
      ""
    );

    const newList: ListItem[] = [
      ...list,
      {
        name,
        slug,
      },
    ];
    setList(newList);
    writeStorage("list", newList);
    setListItem("");
  };

  const submitHandler: () => void = async () => {
    try {
      setLoading(true);
      const data = await requestPrice(list);
      setPrices(data);
    } catch (err) {
      alert("Something went wrong! Try after sometime.");
    }
    setLoading(false);
  };

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
            onChange={(e: FormEvent<HTMLInputElement>) =>
              setListItem((e.target as HTMLInputElement).value)
            }
          />
          <Button className="btn-light mt-4" onClick={addHandler}>
            Add
          </Button>
        </Col>
      </Row>
      {list?.length && (
        <Row className="p-4 mx-auto">
          <Col md={12}>
            <ListGroup className="">
              {list.map(({ name, slug }: ListItem) => (
                <ListGroup.Item key={slug}>{name}</ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
        </Row>
      )}
      <Row>
        <Col md={12} className="text-center">
          {loading ? (
            <Spinner
              animation="grow"
              role="status"
              style={{
                color: "#7c3aed",
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
        pinCodes.map((pinCode: string) => (
          <Row className="p-4 mx-auto" key={pinCode}>
            <Col md={12}>
              <strong>PIN: {pinCode}</strong>
              {Object.values(prices[pinCode as keyof PriceArr]).map(
                (productsArr: PriceItem[], index: number) => (
                  <ListGroup key={pinCode + index}>
                    <ListGroup.Item key={pinCode + index + 1}>
                      {productsArr.map((product: PriceItem, i: number) => {
                        return (
                          <div key={i}>
                            {product.name} has price {product.price}
                          </div>
                        );
                      })}
                    </ListGroup.Item>
                  </ListGroup>
                )
              )}
            </Col>
          </Row>
        ))
      ) : (
        <div />
      )}
    </div>
  );
};

export default App;
