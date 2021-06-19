import { useState, FormEvent } from 'react'
import { Modal, Row, Col, Button } from 'react-bootstrap'
import { AddPinCodeProps } from '../types'

function AddPinCodeModal(props: AddPinCodeProps) {
  const [code, setCode] = useState('')
  const [storeId, setStoreId] = useState('')
  const { show, setModal, onConfirm } = props

  return (
    <Modal size="lg" show={show} onHide={setModal}>
      <Row className="p-4 text-center">
        <p className="pl-3">Enter Pin Code:</p>
        <Col md={12} className="mb-2">
          <input
            className="w-100"
            value={code}
            onChange={(e: FormEvent<HTMLInputElement>) =>
              setCode((e.target as HTMLInputElement).value)
            }
          />
        </Col>
        <p className="pl-3">Enter Store ID:</p>
        <Col md={12} className="mb-2">
          <input
            className="w-100"
            value={storeId}
            onChange={(e: FormEvent<HTMLInputElement>) =>
              setStoreId((e.target as HTMLInputElement).value)
            }
          />
        </Col>
        <Col md={12} className="mt-2">
          <Button
            className="btn-light mr-2"
            variant="primary"
            onClick={() => {
              if (code.length && storeId.length) {
                onConfirm(code, storeId)
                setCode('')
                setStoreId('')
                setModal(false)
              } else {
                alert('Kuch toh likh be!')
              }
            }}
          >
            <span>Confirm</span>
          </Button>
          <Button variant="outline-danger" onClick={() => setModal(false)}>
            Cancel
          </Button>
        </Col>
      </Row>
    </Modal>
  )
}

export default AddPinCodeModal
