import { useState, FormEvent } from 'react'
import { Row, Col, Button, Spinner, ListGroup } from 'react-bootstrap'
import { writeStorage, useLocalStorage } from '@rehooks/local-storage'
import DeleteIcon from '@material-ui/icons/Delete'

import './App.css'
import { requestPrice } from './util/api'
import { PriceItem, PriceArr, ListItem } from './types'

const capitalize = (string: string) => {
  return string[0].toUpperCase() + string.slice(1).toLowerCase()
}

const DEFAULT_PRICES = {
  400029: {
    'Dummy product': [
      {
        name: 'Test Product - 16 Pieces : 200 gms',
        price: '460.00',
      },
    ],
  },
}

const App = (): JSX.Element => {
  const [localList] = useLocalStorage<ListItem[]>('list', [])
  const [listItem, setListItem] = useState<string>('')
  const [list, setList] = useState<ListItem[]>(localList)

  const [prices, setPrices] = useState<PriceArr>(DEFAULT_PRICES)
  const [loading, setLoading] = useState<boolean>(false)

  const addHandler: () => void = () => {
    if (listItem.length) {
      const slug = listItem.split('/')[listItem.split('/').length - 1]
      const nameList = slug.split('-')

      const name = nameList.reduce(
        (acc, curr) => acc + ' ' + (curr.length ? capitalize(curr) : ''),
        ''
      )

      const newList: ListItem[] = [
        ...list,
        {
          name,
          slug,
        },
      ]
      setList(newList)
      writeStorage('list', newList)
      setListItem('')
    } else {
      alert('Kuch toh likh be!')
    }
  }

  const clearHandler: () => void = () => {
    const newList: ListItem[] = []
    setList(newList)
    writeStorage('list', newList)
    setListItem('')
  }

  const submitHandler: () => void = async () => {
    try {
      setLoading(true)
      const data = await requestPrice(list)
      setPrices(data)
    } catch (err) {
      alert('Something went wrong! Try after sometime.')
    }
    setLoading(false)
  }

  const deleteHandler: (arg0: string) => void = (slug: string) => {
    const updatedList = list.filter(item => item.slug !== slug)
    setList(updatedList)
    writeStorage('list', list)
  }

  const pinCodes = Object.keys(prices)

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
          <Button className="btn-light mt-4 ml-2" onClick={clearHandler}>
            Clear All
          </Button>
        </Col>
      </Row>
      {list?.length ? (
        <Row className="p-4 mx-auto">
          <Col md={12}>
            <ListGroup className="">
              {list.map(({ name, slug }: ListItem) => (
                <ListGroup.Item
                  key={slug}
                  className="d-flex justify-content-between"
                >
                  <div>{name}</div>
                  <DeleteIcon onClick={() => deleteHandler(slug)} />
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
        </Row>
      ) : (
        <Row>
          <Col md={12} className="ml-5">
            No products found!
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
                color: '#7c3aed',
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
                        )
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
  )
}

export default App
