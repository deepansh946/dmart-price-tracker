import { useState, Children } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Dropdown, Row, Col } from 'react-bootstrap'
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
  const [dmartPincodes] = useLocalStorage<PinCodes[]>(
    'dmart pinCodes',
    PIN_CODES
  )
  const [otherPincodes] = useLocalStorage<PinCodes[]>(
    'other pinCodes',
    PIN_CODES
  )
  const [carts, setCarts] = useState(localCart)
  const [dPinCodes, setDPinCodes] = useState(dmartPincodes)
  const [oPinCodes, setOPinCodes] = useState(otherPincodes)
  const [isDmart, setIsDmart] = useState(true)

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
    if (isDmart) {
      const updatedPinCodes = [...dPinCodes, { code, storeId }]
      setDPinCodes(updatedPinCodes)
      writeStorage('dmart pinCodes', updatedPinCodes)
    } else {
      const updatedPinCodes = [...oPinCodes, { code, storeId }]
      setOPinCodes(updatedPinCodes)
      writeStorage('other pinCodes', updatedPinCodes)
    }
  }

  const deletePinCode: (code: string, isDmart: Boolean) => void = (
    code,
    isDmart
  ) => {
    if (isDmart) {
      const updatedPinCodes = dPinCodes.filter(pin => pin.code !== code)
      setDPinCodes([...updatedPinCodes])
      writeStorage('dmart pinCodes', updatedPinCodes)
    } else {
      const updatedPinCodes = oPinCodes.filter(pin => pin.code !== code)
      setOPinCodes([...updatedPinCodes])
      writeStorage('other pinCodes', updatedPinCodes)
    }
  }

  const undoPinCodes = () => {
    setDPinCodes(PIN_CODES)
    setOPinCodes(PIN_CODES)
    writeStorage('other pinCodes', PIN_CODES)
    writeStorage('dmart pinCodes', PIN_CODES)
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
            {Children.toArray(
              carts.map(cart => (
                <Dropdown>
                  <Dropdown.Toggle
                    variant="success"
                    id="dropdown-basic"
                    className="ml-2"
                  >
                    <div
                      className="badge badge-success ml-2 font-18 cursor-pointer"
                      onClick={() => history.push(cart)}
                    >
                      {cart}
                    </div>
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item href={`dmart/${cart}`}>Dmart</Dropdown.Item>
                    <Dropdown.Item href={`others/${cart}`}>
                      Others
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ))
            )}
          </div>
        </Col>
      </Row>
      <Row className="p-4 mx-auto">
        <Col md={12}>
          <h4 className="text-center mb-3">
            Dmart Pin Codes
            <AddIcon
              className="ml-2 mb-1 cursor-pointer"
              onClick={() => {
                togglePinCodeModal(true)
                setIsDmart(true)
              }}
            />
            <UndoIcon
              className="ml-2 mb-1 cursor-pointer"
              onClick={() => undoPinCodes()}
            />
          </h4>
          <div className="d-flex align-items-center justify-content-center">
            {dPinCodes.map(({ code }) => (
              <div key={code} className="badge badge-success p-3 ml-2 font-18">
                {code}
                <ClearIcon
                  className="cursor-pointer pincode"
                  onClick={() => deletePinCode(code, true)}
                />
              </div>
            ))}
          </div>
        </Col>
      </Row>

      <Row className="p-4 mx-auto">
        <Col md={12}>
          <h4 className="text-center mb-3">
            Other Pin Codes
            <AddIcon
              className="ml-2 mb-1 cursor-pointer"
              onClick={() => {
                togglePinCodeModal(true)
                setIsDmart(false)
              }}
            />
            <UndoIcon
              className="ml-2 mb-1 cursor-pointer"
              onClick={() => undoPinCodes()}
            />
          </h4>
          <div className="d-flex align-items-center justify-content-center">
            {oPinCodes.map(({ code }) => (
              <div key={code} className="badge badge-success p-3 ml-2 font-18">
                {code}
                <ClearIcon
                  className="cursor-pointer pincode"
                  onClick={() => deletePinCode(code, false)}
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
