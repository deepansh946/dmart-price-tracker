import { useState, FormEvent } from "react";
import { Modal, Row, Col, Button } from "react-bootstrap";

function AddCartModal() {
  const [input, setInput] = useState("");
  // const { show, setModal, onConfirm } = props

  return (
    <Row className="p-4 text-center">
      <Col md={12}>
        <input
          className="w-100"
          value={input}
          onChange={(e: FormEvent<HTMLInputElement>) =>
            setInput((e.target as HTMLInputElement).value)
          }
        />
      </Col>
      <Col md={12} className="mt-2">
        <Button className="mr-2" variant="primary">
          <span>Confirm</span>
        </Button>
        {/* <Button variant="outline-primary" onClick={() => setModal(false)}> */}
        {/* Cancel */}
        {/* </Button> */}
      </Col>
    </Row>
  );
}

export default AddCartModal;
