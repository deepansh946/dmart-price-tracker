import { useState, FormEvent, useEffect } from 'react'
import TableExport from 'tableexport'
import { Row, Col, Button, Spinner, ListGroup } from 'react-bootstrap'
import DeleteIcon from '@material-ui/icons/Delete'
import { writeStorage, useLocalStorage } from '@rehooks/local-storage'

import { requestPrice } from '../util/api'
import { CartProps, ListItem, getKeyValue, Item, PriceArr } from '../types'
import { PINS } from '../resources/constants'

const capitalize = (string: string) => {
  return string[0].toUpperCase() + string.slice(1).toLowerCase()
}

const DEFAULT_PRICES = {
  'Dummy Product': [
    {
      pin: '400100',
      price: '460.00',
    },
  ],
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
  const [text, setText] = useState<string>()

  const exportTableToExcel = (tableID: string) => {
    TableExport(document.getElementsByTagName('table'))
  }

  useEffect(() => {
    if (text) {
      const producstArr = text.split(' ')[0].split('\n')
      const productsList = producstArr.map(product => {
        const slug = product.split('/')[product.split('/').length - 1]
        const nameList = slug.split('-')

        const name = nameList.reduce(
          (acc, curr) => acc + ' ' + (curr.length ? capitalize(curr) : ''),
          ''
        )

        return {
          name,
          slug,
        }
      })

      const newList = {
        ...list,
        [cart]: [
          ...(getKeyValue(list, cart) ? getKeyValue(list, cart) : []),
          ...productsList,
        ],
      }
      setList(newList)
      writeStorage('list', newList)
    }
    // eslint-disable-next-line
  }, [text])

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

  const importHandler = () => {
    document.getElementById('hiddenFileInput')?.click()
  }

  const names = Object.keys(prices)
  const pinPrices = Object.values(prices)
  const totalLen = PINS.length

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
          <Button
            className="btn-light mt-4 ml-2"
            onClick={() => importHandler()}
          >
            Import
          </Button>
          <input
            type="file"
            style={{ display: 'none' }}
            accept=".txt"
            id="hiddenFileInput"
            onChange={e => {
              const reader = new FileReader()
              reader.onload = async e => {
                if (e.target?.result) {
                  const text = e.target.result
                  setText(text + '')
                }
              }
              const target = e.target as HTMLInputElement
              const file: File = (target.files as FileList)[0]
              reader.readAsText(file)
            }}
          />
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

      <button
        className="btn-light"
        onClick={() => exportTableToExcel('price-table')}
      >
        Export to Excel
      </button>
      <div className="p-4">
        <table className="table table-striped" id="price-table">
          <thead>
            <tr>
              <th>Name</th>
              {PINS.map(code => (
                <th>{code}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {names.map((name, i) => (
              <tr>
                <td>{name}</td>
                {pinPrices[i].map(({ price }) => {
                  return <td>{price}</td>
                })}
                {Array.from({ length: totalLen - pinPrices[i].length }).map(
                  _ => (
                    <td>NA</td>
                  )
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Cart
