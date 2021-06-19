import { useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Row, Col } from 'react-bootstrap'
import { writeStorage, useLocalStorage } from '@rehooks/local-storage'
import {
  Clear as ClearIcon,
  Add as AddIcon,
  Undo as UndoIcon,
} from '@material-ui/icons'

import { PinCodes } from '../types'
import AddCartModal from '../components/AddCartModal'
import AddPinCodeModal from '../components/AddPinCodeModal'
import { PIN_CODES } from '../resources/constants'

const Home = (props: RouteComponentProps): JSX.Element => {
  const { history } = props
  const [localCart] = useLocalStorage<string[]>('carts', [])
  const [localPincodes] = useLocalStorage<PinCodes[]>('pinCodes', PIN_CODES)
  const [carts, setCarts] = useState(localCart)
  const [pinCodes, setPinCodes] = useState(localPincodes)

  const [show, setShow] = useState<boolean>(false)
  const [showPinCodeModal, togglePinCodeModal] = useState<boolean>(false)

  const addCart: (text: string) => void = text => {
    const updatedCart = [...carts, text]
    setCarts(updatedCart)
    writeStorage('carts', updatedCart)
  }

  const addPinCode: (code: string, storeId: string) => void = (
    code,
    storeId
  ) => {
    const updatedPinCodes = [...pinCodes, { code, storeId }]
    setPinCodes(updatedPinCodes)
    writeStorage('pinCodes', updatedPinCodes)
  }

  const deletePinCode: (code: string) => void = code => {
    const updatedPinCodes = pinCodes.filter(pin => pin.code !== code)
    setPinCodes([...updatedPinCodes])
    writeStorage('pinCodes', updatedPinCodes)
  }

  const undoPinCodes = () => {
    setPinCodes(PIN_CODES)
    writeStorage('pinCodes', PIN_CODES)
  }

  return (
    <>
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
      <Row className="p-4 mx-auto">
        <Col md={12}>
          <h4 className="text-center mb-3">
            Pin Codes
            <AddIcon
              className="ml-2 mb-1 cursor-pointer"
              onClick={() => togglePinCodeModal(true)}
            />
            <UndoIcon
              className="ml-2 mb-1 cursor-pointer"
              onClick={() => undoPinCodes()}
            />
          </h4>
          <div className="d-flex align-items-center justify-content-center">
            {pinCodes.map(({ code }) => (
              <div key={code} className="badge badge-success p-3 ml-2 font-18">
                {code}
                <ClearIcon
                  className="cursor-pointer pincode"
                  onClick={() => deletePinCode(code)}
                />
              </div>
            ))}
          </div>
        </Col>
      </Row>

      <AddCartModal
        show={show}
        setModal={setShow}
        onConfirm={(text: string) => {
          addCart(text)
        }}
      />
      <AddPinCodeModal
        show={showPinCodeModal}
        setModal={togglePinCodeModal}
        onConfirm={(code: string, storeId: string) => {
          addPinCode(code, storeId)
        }}
      />
    </>
  )
}

export default Home
