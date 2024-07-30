import { Modal } from 'react-bootstrap';

export const DisplayFileModal = (props) => {
  return (
    <Modal
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={props.show}
      onHide={props.onHide}
      size="lg"
    >
      <Modal.Header closeButton>
        
      </Modal.Header>
      <Modal.Body>
        <img src={props.data.url} alt='file'/>
      
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  );
}