import { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { crudService } from '../services/crudService';

export const DisplayFileModal = (props) => {
  const { staff } = props
  const [loading, setLoading] = useState(false);
  const [data, setdata] = useState([]);

  const fetchData = () => {
    setLoading(true);
    if (staff) {
      
      crudService.getOneInstaller(staff._id).then((res) => {
      const {data} = res;
        setdata(data);
        setTimeout(() => setLoading(false), 500);
      });
    }
  };

  useEffect(() => {
      fetchData();
  }, [staff]);

  return (
    <Modal
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={props.show}
      onHide={props.onHide}
      size="md"
    >
      <Modal.Header closeButton>
        
      </Modal.Header>
      <Modal.Body>
      <div className="card-grid-2 hover-up">
        <div className="card-grid-2-image-left">
          <span className="flash" />
          <div className="image-box">
          <img src="/images/profile.webp" alt="jobBox" style={{width: '20%'}}/>
          </div>
          <div className="right-info">
          </div>
        </div>
        <div className="card-block-info">
    <h6>
      <a href="job-details.html">{staff?.fullName}</a>
    </h6>
    <div className="mt-5">
      <span className="card-briefcase">{staff?.vendor?.name}</span>
    </div>

    <hr/>
    <p> Number of Meters Assigned: <b style={{ fontWeight: 'bolder', color: '#5e81ff'}}>{data?.assignedMeters}</b> </p>
    <hr/>

    <p> Number of Meters Installed: <b style={{ fontWeight: 'bolder', color: '#5e81ff'}}>{data?.installedMeters}</b> </p>
    <hr/>
   
    
      </div>
</div>

      
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  );
}