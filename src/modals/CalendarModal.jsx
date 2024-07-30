'use client';
import { useState, useEffect } from 'react'
import { Modal } from 'react-bootstrap';
import Calendar from 'react-calendar';



export const CalendarModal = (props) => { 
  const [value, onChange] = useState(new Date());

  useEffect(() => {
    if (value) {
      props.data((value))
      return props.onHide
    }
  }, [value])

  return (
    <Modal
      aria-labelledby="contained-modal-title-vcenter"
      centered 
      show={props.show} onHide={props.onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Filter By Date</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Calendar onChange={onChange} value={value} selectRange={true} />
      </Modal.Body>
      <Modal.Footer>
      </Modal.Footer>
    </Modal>
  );
};
