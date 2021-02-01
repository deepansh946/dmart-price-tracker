import { useState, FormEvent } from 'react'
import { Modal, Row, Col, Button } from 'react-bootstrap'
import { AddModalProps } from '../types'

function AddCartModal(props: AddModalProps) {
  const [input, setInput] = useState('')
  const { show, setModal, onConfirm } = props

  return (
    <Modal size="lg" show={show} onHide={setModal}>
      <Row className="p-4 text-center">
        <p className="pl-3">Enter Cart Name:</p>
        <Col md={12} className="mb-2">
          <input
            className="w-100"
            value={input}
            onChange={(e: FormEvent<HTMLInputElement>) =>
              setInput((e.target as HTMLInputElement).value)
            }
          />
        </Col>
        <Col md={12} className="mt-2">
          <Button
            className="btn-light mr-2"
            variant="primary"
            onClick={() => {
              if (input.length) {
                onConfirm(input)
                setInput('')
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

export default AddCartModal
