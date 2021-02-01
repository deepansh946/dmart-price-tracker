import { useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Row, Col } from 'react-bootstrap'
import { writeStorage, useLocalStorage } from '@rehooks/local-storage'
import AddIcon from '@material-ui/icons/Add'

import AddCartModal from '../components/AddCartModal'

const Home = (props: RouteComponentProps): JSX.Element => {
  const { history } = props
  const [localCart] = useLocalStorage<string[]>('carts', [])
  const [carts, setCarts] = useState(localCart)

  const [show, setShow] = useState<boolean>(false)

  const addCart: (text: string) => void = text => {
    const updatedCart = [...carts, text]
    setCarts(updatedCart)
    writeStorage('carts', updatedCart)
  }

  return (
    <>
      <div>
        <Row className="p-4 mx-auto">
          <Col md={12}>
            <h4 className="text-center mb-3">
              Carts
              <AddIcon
                className="ml-2 mb-1 cursor-pointer"
                onClick={() => setShow(true)}
              />
            </h4>
            <div className="d-flex align-items-center justify-content-center">
              {carts.map(cart => (
                <div
                  key={cart}
                  className="badge badge-success p-3 ml-2 font-18 cursor-pointer"
                  onClick={() => history.push(cart)}
                >
                  {cart}
                </div>
              ))}
            </div>
          </Col>
        </Row>
      </div>
      <AddCartModal
        show={show}
        setModal={setShow}
        onConfirm={(text: string) => {
          addCart(text)
        }}
      />
    </>
  )
}

export default Home
