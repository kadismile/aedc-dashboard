import {useState, useEffect} from 'react'
import { store } from '../redux/store';
import { Modal } from 'react-bootstrap';
import { reportService } from '../services/reportsService';
import moment from 'moment';
import { Responder, CPS } from '../constants';


export const ReviewModal = (props) => {
  let user = store?.getState()?.user?.user
  if (user) {
    user = user.user
  }
  const [ reportComments, setReportComments ] = useState([]);

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = () => {
    reportService.getReportComments(props.report._id)
    .then((res) => {
      const { status, data } = res
      if (status === 'success') {
        setReportComments(data)
      }
    })
  }

  const closeModal = () => {
    props.onHide()
  }

  const isResponder = props.user.department.name === Responder;

  const reporHistoryItems = (rHistory) => {
    return  (
      <div className="item-timeline"> 
        <div className="timeline-year"> 
        <span>{moment(rHistory?.createdAt).format('DD MMM YYYY h:mma')}
        <br/>
        by { rHistory?.userId.fullName }
        </span>
        <span></span>
        </div>
        <div className="timeline-info"> 
        <p className="color-brand-1 mb-20" style={{
          fontSize: '15px', wordWrap: 'break-word', width: '1000px'
        }}>
          {rHistory?.comments}
          </p>
        <hr/>
        </div>
      </div>
    )
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
        
        <div className="box-timeline mt-50">
          { 
            reportComments?.map((rHistory) => {
              /* {
                (!isResponder || (isResponder && rHistory.currentDepartment.acronym === "CPS")) &&
                reporHistoryItems(rHistory)
              } */
                return (
                <>
                {/* {
                  !isResponder && 
                      reporHistoryItems(rHistory)
                } */}
                {/* {
                  isResponder && rHistory?.currentDepartment?.acronym === CPS && 
                      reporHistoryItems(rHistory)
                } */}
                {
                  reporHistoryItems(rHistory)
                }
                </>
              )})
            }          
          </div>


      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  );
}