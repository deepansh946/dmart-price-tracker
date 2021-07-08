import { Children, useState, FormEvent, useEffect } from 'react'
import TableExport from 'tableexport'
import { Badge, Row, Col, Button, Spinner, ListGroup } from 'react-bootstrap'
import { Clear as ClearIcon, Delete as DeleteIcon } from '@material-ui/icons'
import { writeStorage, useLocalStorage } from '@rehooks/local-storage'
import BootstrapSwitchButton from 'bootstrap-switch-button-react'

import { requestPrice } from '../util/api'
import {
  CartProps,
  ListItem,
  getKeyValue,
  Item,
  PriceArr,
  PinCodes,
} from '../types'
import { PIN_CODES } from '../resources/constants'

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

  const [localPincodes] = useLocalStorage<PinCodes[]>('pinCodes', PIN_CODES)
  const [localList] = useLocalStorage<ListItem>('list', {})
  const [localPrices] = useLocalStorage<ListItem>(`${cart} prices`, {})

  const [pinCodes, setPinCodes] = useState<PinCodes[]>(localPincodes)
  const [prices, setPrices] = useState<PriceArr>(DEFAULT_PRICES)
  const [listItem, setListItem] = useState<string>('')
  const [list, setList] = useState<ListItem>(localList)
  const [loading, setLoading] = useState<boolean>(false)
  const [text, setText] = useState<string>()

  const exportTableToExcel = () => {
    const selector = document.querySelectorAll('#priceTable')
    const table = new TableExport.TableExport(selector, {
      headers: true,
      footers: true,
      formats: ['xlsx'],
      filename: cart,
      bootstrap: false,
      exportButtons: true,
      position: 'top',
      trimWhitespace: true,
      RTL: false,
      sheetname: 'id',
    })
    const exportData: any = table.getExportData()
    const xlsxData = exportData.priceTable.xlsx // Replace with the kind of file you want from the exportData
    table.export2file(
      xlsxData.data,
      xlsxData.mimeType,
      xlsxData.filename,
      xlsxData.fileExtension
    )
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
      const data = await requestPrice(list[cart], pinCodes)
      setPrices(data)
      if (!Object.keys(localPrices).length) {
        writeStorage(`${cart} prices`, data)
      }
    } catch (err) {
      alert('Something went wrong! Try after sometime.')
    }
    setLoading(false)
  }

  const deleteHandler: (arg0: string, arg1: string) => void = (
    slug: string,
    name: string
  ) => {
    const filteredList = list[cart].filter((item: Item) => item.slug !== slug)
    const updatedList = {
      ...list,
      [cart]: filteredList,
    }
    setList(updatedList)
    writeStorage('list', updatedList)
    const productNames = Object.keys(localPrices)
    productNames.forEach(product => {
      if (product.includes(name.trim())) {
        delete localPrices[product]
      }
    })
    writeStorage(`${cart} prices`, localPrices)
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
      alert('Please enter a valid link.')
    }
  }

  const clearHandler: () => void = () => {
    const newList = {
      ...list,
      [cart]: [],
    }
    setList(newList)
    writeStorage('list', newList)
    writeStorage(`${cart} prices`, {})
    setListItem('')
  }

  const importHandler = () => {
    document.getElementById('hiddenFileInput')?.click()
  }

  const syncHandler = () => {
    writeStorage(`${cart} prices`, prices)
  }

  const deletePinCode: (code: string) => void = code => {
    const newPinCodes = pinCodes.filter(pin => pin.code !== code)
    setPinCodes([...newPinCodes])
    writeStorage('pinCodes', newPinCodes)
  }

  const names = Object.keys(prices)
  const pinPrices = Object.values(prices)
  const totalLen = pinCodes.length
  const oldPinPrices = Object.values(localPrices)

  return (
    <div>
      <div className="my-3 text-center">
        <h2>{cart}</h2>
      </div>
      <div className="mx-3 text-right">
        <BootstrapSwitchButton
          style="ml-2 mt-4"
          checked={true}
          onlabel="Dmart"
          offlabel="Others"
          onChange={(checked: boolean) => {
            console.log(checked)
          }}
          width={100}
        />
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
          <Button className="btn-light mt-4 ml-2" onClick={() => syncHandler()}>
            Sync
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
      <Row className="p-4 mx-auto">
        <Col md={12}>
          <h2>Pin Codes</h2>
          {Children.toArray(
            pinCodes.map(({ code }) => (
              <Badge pill variant="success" className="pincode mr-2 p-2">
                {code}
                <ClearIcon
                  className="cursor-pointer pincode"
                  onClick={() => {
                    deletePinCode(code)
                  }}
                />
              </Badge>
            ))
          )}
        </Col>
      </Row>
      <Row
        className="p-4 mx-auto"
        style={{
          display: list[cart]?.length ? '' : 'none',
        }}
      >
        <Col md={12}>
          <ListGroup>
            {Children.toArray(
              list[cart]?.map(({ name, slug }: ListItem) => (
                <ListGroup.Item className="d-flex justify-content-between">
                  <div>{name}</div>
                  <DeleteIcon
                    className="cursor-pointer"
                    onClick={() => deleteHandler(slug, name)}
                  />
                </ListGroup.Item>
              ))
            )}
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
      <div
        className="text-right"
        style={{
          padding: '1rem 1rem 0rem 1rem',
        }}
      >
        <Button
          className="btn-light p-2 cursor-pointer"
          onClick={() => exportTableToExcel()}
        >
          Export
        </Button>
      </div>
      <div className="p-4">
        <table className="table table-striped" id="priceTable">
          <thead>
            <tr>
              <th>Name</th>
              {Children.toArray(pinCodes.map(({ code }) => <th>{code}</th>))}
            </tr>
          </thead>
          <tbody>
            {Children.toArray(
              names.map((name, i) => (
                <tr>
                  <td>{name}</td>
                  {Children.toArray(
                    pinPrices[i].map(({ price }, index) => {
                      let isPriceChanged = 0
                      if (
                        Object.keys(oldPinPrices).length &&
                        oldPinPrices[i][index]?.price
                      ) {
                        isPriceChanged =
                          parseInt(oldPinPrices[i][index].price) -
                          parseInt(price)
                      }
                      return (
                        <td className={isPriceChanged ? 'bg-info' : ''}>
                          {price}
                        </td>
                      )
                    })
                  )}
                  {Children.toArray(
                    Array.from({
                      length: totalLen - pinPrices[i].length,
                    }).map(_ => <td>NA</td>)
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Cart
