
import { Modal } from 'react-bootstrap';

export const SMSReportModal = (props) => {
  const closeModal = () => {
    props.onHide()
  }

  return (
    <Modal
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={props.show}
      onHide={closeModal}
      size="lg"
    >
      <Modal.Header closeButton>
        
      </Modal.Header>
      <Modal.Body style={{padding: '1rem'}}>
        <div className="text-center">
            <h5 className="mt-10 mb-5 text-brand-1">{props.title} </h5>
        </div>
      
      <p> {props?.data?.message} </p>
    
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  );
}
