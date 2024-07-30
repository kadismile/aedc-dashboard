import { store } from '../redux/store';
import { Modal } from 'react-bootstrap';
import { reportService } from '../services/reportsService';
import toastr from 'toastr';
import styles from '../helpers/report.module.css'

export const AssignmentModal = (props) => {

  let user = store?.getState()?.user?.user
  if (user) {
    user = user.user
  }
  const handleSubmit = async () => {
    const data = {
      reportId: props.data,
      userId: user._id,
      responder: user?.responder ? [user.responder] : undefined
    }
    const response = await reportService.acceptReport(data)
    const { message } = response
    toastr.success(message, { timeOut: 6000 });
    props.onHide({closeAssModal: true })
  }


  return (
    
  <Modal
        aria-labelledby="contained-modal-title-vcenter"
        centered 
        show={props.show} onHide={() => props.onHide({closeAssModal: true })}>
        <Modal.Header closeButton>
          <Modal.Title> <h6 style={{textAlign: 'center'}}>Work on this Report ? </h6></Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <div className={styles.container}>
          <button className={styles.right_button} onClick={handleSubmit}>Yes</button>
          <button className={styles.left_button} onClick={() => props.onHide({closeAssModal: true})}>No</button>
      </div>
        </Modal.Body>
        <Modal.Footer>
        </Modal.Footer>
      </Modal>
    );
}