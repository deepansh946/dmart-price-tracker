import { useState, FormEvent } from 'react'
import { Row, Col, Button, Spinner, ListGroup } from 'react-bootstrap'
import DeleteIcon from '@material-ui/icons/Delete'
import { writeStorage, useLocalStorage } from '@rehooks/local-storage'

import { requestPrice } from '../util/api'
import { CartProps } from '../types'
import { PriceItem, PriceArr, ListItem, getKeyValue, Item } from '../types'
import { stringify } from 'querystring'

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

function Cart(props: CartProps) {
  const {
    match: {
      params: { cart },
    },
  } = props

  const [prices, setPrices] = useState<PriceArr>(DEFAULT_PRICES)
  const [localList] = useLocalStorage<ListItem>('list', {})
  const [listItem, setListItem] = useState<string>('')
  const [list, setList] = useState<ListItem>(localList)
  const [loading, setLoading] = useState<boolean>(false)

  const submitHandler: () => void = async () => {
    try {
      setLoading(true)
      const data = await requestPrice(list[cart])
      setPrices(data)
    } catch (err) {
      alert('Something went wrong! Try after sometime.')
    }
    setLoading(false)
  }

  const deleteHandler: (arg0: string) => void = (slug: string) => {
    const filteredList = list[cart].filter((item: Item) => item.slug !== slug)
    const updatedList = {
      ...list,
      [cart]: filteredList,
    }
    setList(updatedList)
    writeStorage('list', updatedList)
  }

  const addHandler: () => void = () => {
    if (listItem.length) {
      const slug = listItem.split('/')[listItem.split('/').length - 1]
      const nameList = slug.split('-')

      const name = nameList.reduce(
        (acc, curr) => acc + ' ' + (curr.length ? capitalize(curr) : ''),
        ''
      )

      const newList = {
        ...list,
        [cart]: [
          ...(getKeyValue(list, cart) ? getKeyValue(list, cart) : []),
          {
            name,
            slug,
          },
        ],
      }

      setList(newList)
      writeStorage('list', newList)
      setListItem('')
    } else {
      alert('Kuch toh likh be!')
    }
  }

  const clearHandler: () => void = () => {
    const newList = {
      ...list,
      [cart]: [],
    }
    setList(newList)
    writeStorage('list', newList)
    setListItem('')
  }

  const pinCodes = Object.keys(prices)
  return (
    <div>
      <div className="my-3 text-center">
        <h2>{cart}</h2>
      </div>
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
      <Row
        className="p-4 mx-auto"
        style={{
          display: list[cart]?.length ? '' : 'none',
        }}
      >
        <Col md={12}>
          <ListGroup className="">
            {list[cart]?.map(({ name, slug }: ListItem) => (
              <ListGroup.Item
                key={slug}
                className="d-flex justify-content-between"
              >
                <div>{name}</div>
                <DeleteIcon
                  className="cursor-pointer"
                  onClick={() => deleteHandler(slug)}
                />
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
      </Row>
      <Row
        style={{
          display: list[cart]?.length ? 'none' : '',
        }}
      >
        <Col md={12} className="ml-5">
          No products found!
        </Col>
      </Row>
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
            <Button
              disabled={list[cart]?.length === 0}
              className="btn-light"
              onClick={submitHandler}
            >
              Submit
            </Button>
          )}
        </Col>
      </Row>
      {pinCodes.length ? (
        pinCodes.map((pinCode: string) => (
          <Row className="p-4 mx-auto" key={pinCode}>
            <Col md={12}>
              <b>PIN: {pinCode}</b>
              <table className="table w-100 table-bordered">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Price</th>
                  </tr>
                </thead>
                {Object.values(prices[pinCode as keyof PriceArr]).map(
                  (productsArr: PriceItem[], index: number) => (
                    <tbody>
                      {productsArr.map((product: PriceItem, i: number) => {
                        return (
                          <tr key={pinCode + index + product.name.length}>
                            <td key={pinCode + index + 1}>
                              <div key={i}>{product.name}</div>
                            </td>
                            <td> {product.price}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  )
                )}
              </table>
            </Col>
          </Row>
        ))
      ) : (
        <div />
      )}
    </div>
  )
}

export default Cart
