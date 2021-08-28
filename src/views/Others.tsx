import { Children, useState } from 'react'
import TableExport from 'tableexport'
import { Row, Col, Button, Spinner, ListGroup } from 'react-bootstrap'
import { Delete as DeleteIcon } from '@material-ui/icons'
import { writeStorage, useLocalStorage } from '@rehooks/local-storage'
import { CSVReader } from 'react-papaparse'

import { requestOtherPrices } from '../util/api'
import { CartProps, ListItem } from '../types'

function Cart(props: CartProps) {
  const {
    match: {
      params: { cart },
    },
  } = props

  const [localList] = useLocalStorage<ListItem>(`others ${cart} list`, [])
  // const [localPrices] = useLocalStorage<ListItem>(`${cart} prices`, {})

  const [prices, setPrices] = useState<any>({
    bigBasket: [1],
    flipkart: [1],
    grofers: [1],
  })
  const [list, setList] = useState<ListItem>(localList)
  const [loading, setLoading] = useState<boolean>(false)

  const exportTableToExcel = () => {
    const selector = document.querySelectorAll('#otherPriceTable')
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
    const xlsxData = exportData.otherPriceTable.xlsx // Replace with the kind of file you want from the exportData
    table.export2file(
      xlsxData.data,
      xlsxData.mimeType,
      xlsxData.filename,
      xlsxData.fileExtension
    )
  }

  const submitHandler: () => void = async () => {
    try {
      setLoading(true)
      const data = await requestOtherPrices(list)

      setPrices(data)
    } catch (err) {
      alert('Something went wrong! Try after sometime.')
    }
    setLoading(false)
  }

  const deleteHandler: (arg0: number) => void = (index: number) => {
    const newList = Object.values(list).map(arr => {
      const newArr = arr.filter((element: string, i: number) => i !== index)
      return newArr
    })

    const amazon = newList[0].map((data: any) => data)
    const flipkart = newList[1].map((data: any) => data)
    const bigBasket = newList[2].map((data: any) => data)
    const grofers = newList[3].map((data: any) => data)

    const obj = {
      amazon,
      flipkart,
      bigBasket,
      grofers,
    }

    setList(obj)
    writeStorage(`others ${cart} list`, obj)
  }

  const clearHandler: () => void = () => {
    const obj = {
      amazon: [],
      flipkart: [],
      bigBasket: [],
      grofers: [],
    }
    setList(obj)
    writeStorage(`others ${cart} list`, obj)
  }

  const handleOnDrop: (data: any) => void = data => {
    const newData = data.map((obj: any) => obj.data)

    const amazon = newData.slice(1).map((data: any) => data[0])
    const flipkart = newData.slice(1).map((data: any) => data[1])
    const bigBasket = newData.slice(1).map((data: any) => data[2])
    const grofers = newData.slice(1).map((data: any) => data[3])

    const obj = {
      amazon,
      flipkart,
      bigBasket,
      grofers,
    }

    setList(obj)
    writeStorage(`others ${cart} list`, obj)
  }

  return (
    <div>
      <div className="my-3 text-center">
        <h2>{cart}</h2>
      </div>
      <Row className="p-4 mx-auto">
        <Col md={12}>
          <Button className="btn-light my-4 ml-2" onClick={clearHandler}>
            Clear All
          </Button>
          <CSVReader
            onDrop={handleOnDrop}
            noDrag
            addRemoveButton
            style={{
              dropArea: {
                height: 'auto',
              },
            }}
          >
            <span>Import</span>
          </CSVReader>
        </Col>
      </Row>
      <Row
        className="p-4 mx-auto mt-5"
        style={{
          display: list['amazon']?.length ? '' : 'none',
        }}
      >
        <Col md={12}>
          <ListGroup>
            {Children.toArray(
              list['amazon']?.map((name: string, i: number) => {
                return (
                  <ListGroup.Item
                    className="d-flex justify-content-between"
                    key={name}
                  >
                    <div>{name}</div>
                    <DeleteIcon
                      className="cursor-pointer"
                      onClick={() => deleteHandler(i)}
                    />
                  </ListGroup.Item>
                )
              })
            )}
          </ListGroup>
        </Col>
      </Row>
      <Row
        style={{
          display: list['amazon']?.length ? 'none' : '',
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
              disabled={list['amazon']?.length === 0}
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
        <table className="table table-striped" id="otherPriceTable">
          <thead>
            <tr>
              <th>Product</th>
              <th>BigBasket</th>
              <th>Flipkart</th>
              <th>Grofers</th>
            </tr>
          </thead>
          <tbody>
            {list['amazon']?.map((name: string, i: number) => {
              return (
                <tr key={name}>
                  <th>{name}</th>
                  <th>{prices['bigBasket']?.[i]}</th>
                  <th>{prices['flipkart']?.[i]}</th>
                  <th>{prices['grofers']?.[i]}</th>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Cart
