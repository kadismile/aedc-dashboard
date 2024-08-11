import { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { crudService } from '../services/crudService';
import { CalendarModal } from './CalendarModal';
import moment from 'moment';
import { mkConfig, generateCsv, download } from "export-to-csv";
import { reportService } from '../services/reportsService';
import { VendorDropDown } from '../components/elements/VendorDropDown';
import { StateDropDown } from '../components/elements/StateDropDown';
import { StatusDropDown } from '../components/elements/StatusDropDown';

export const FilterModal = (props) => {
  const [lga, setLga] = useState(["select a state"])
  const [reports, setReports] = useState(["select a state"])
  const [coordinates, setCoordinates] = useState([])
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false)
  const [formValues, setFormValues] = useState({
    state: undefined,
    date: '',
    rawDate: '',
    vendor: undefined,
    meterStatus: undefined,
  })
  const { state, rawDate, vendor, meterStatus } = formValues

  const fetchData = () => {
    const { state, rawDate, vendor } = formValues
    setLoading(true)
    crudService.getMeters({ rawDate, vendor, state, meterStatus }).then((res) => {
      const {
        data: { results },
      } = res
      props.dataFromFilter(results)
      setReports(results)
      setTimeout(() => setLoading(false), 500)
    })
  }

  useEffect(() => {
    fetchData()
  }, [state, rawDate, vendor, meterStatus])

  const handleStateData = (data) => {
    const { value } = data || {}
    setFormValues((prevState) => {
      return {
        ...prevState,
        state: value,
      }
    })
  }

  const handleDataFromDropDown = (data) => {
    const { value } = data || {}
    setFormValues((prevState) => {
      return {
        ...prevState,
        vendor: value,
      }
    })
  }

  const handleDataFromStatus = (data) => {
    const { value } = data || {}
    setFormValues((prevState) => {
      return {
        ...prevState,
        meterStatus: value,
      }
    })
  }

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const calendarData = (calData = []) => {
    if (Array.isArray(calData)) {
      const formatedDates = calData?.map((date) =>moment(date).format('YYYY-MM-DD'))
      setFormValues((prevState) => {
        return {
          ...prevState,
          date: moment(calData[1]).format('LL'),
          rawDate: formatedDates
        };
      });
    }
  }

  const downloadCSV = () => {
    const csvConfig = mkConfig({ 
      useKeysAsHeaders: true ,
      filename: `report-${moment().format("MMM D, YYYY")}`
    });
    const csvData = reportService.prepareCsvData(reports)
    const csv = generateCsv(csvConfig)(csvData);
    download(csvConfig)(csv);
  }

  return (
    <> 
    <CalendarModal show={showModal} onHide={handleCloseModal} data={calendarData}/>
    <Modal
      size='sm'
      dialogClassName="left-modal"
      aria-labelledby="contained-modal-title-vcenter"
      show={props.show}
      onHide={() => props.onHide({addDept: true})}
    >
      <Modal.Header closeButton>
        
      </Modal.Header>
      <Modal.Body>
          <div className="text-center">
            <h5 className="mt-10 mb-5 text-brand-1">Filter </h5>
          </div>
          <form className="login-register text-start mt-20" action="#">
          {/* <div className="form-group">
            <StateDropDown label={"State"} dataToComponent={handleStateData}/>
          </div>  */}
        
       

            <div className="form-group" id='state'>
              <StateDropDown
                label={"State"}
                dataToComponent={handleStateData}
              />
            </div> 

            <div className="form-group">
              <VendorDropDown
                label={"Vendor"}
                dataToComponent={handleDataFromDropDown}
              />
            </div> 

            <div className="form-group">
              <StatusDropDown
                label={"Status"}
                dataToComponent={handleDataFromStatus}
              />
            </div> 

            
              <br/>

              <div className="display-flex2">
              <button 
                  onClick={downloadCSV}
                  className="btn btn-default btn-sm" 
                  type="submit" 
                  style={{padding: '6px 15px'}}
              >
                <i class="fa-solid fa-cloud-download"></i> Download CSv
              </button>
              </div>

            <div> 
            </div>
            <br/>
            
          </form>
      
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal> </>
  );
};
