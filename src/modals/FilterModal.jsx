import { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { crudService } from '../services/crudService';
import StateDropDown from '../components/elements/NigerianStates';
import LGADropDown from '../components/elements/LGADropDown';
import { IncidentType } from '../components/elements/IncidentTypes';
import { CalendarModal } from './CalendarModal';
import moment from 'moment';
import { mkConfig, generateCsv, download } from "export-to-csv";
import { reportService } from '../services/reportsService';
export const FilterModal = (props) => {
  const [lga, setLga] = useState(["select a state"])
  const [reports, setReports] = useState(["select a state"])
  const [coordinates, setCoordinates] = useState([])
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false)
  const [formValues, setFormValues] = useState({
    state: undefined,
    localGovt: undefined,
    incidentType: undefined,
    date: '',
    rawDate: '',
  })
  const { state, localGovt,incidentType, rawDate } = formValues

  const fetchData = () => {
    const { state, localGovt,incidentType, rawDate } = formValues
    setLoading(true)
    crudService.getReports({state, localGovt,incidentType, rawDate}).then((res) => {
      const {
        data: { data },
      } = res
      props.dataFromFilter(data)
      setReports(data)
      prepareCoordinates(data)
      setTimeout(() => setLoading(false), 500)
    })
  }

  useEffect(() => {
    fetchData()
  }, [state, localGovt, incidentType, rawDate])

  const prepareCoordinates = (reports) => {
    let coordinates = []
    if (reports?.length) {
      for (let report of reports) {
        coordinates.push(report)
      }
    }
    setCoordinates(coordinates)
  }

  const handleStateData = (data) => {
    const { value } = data || {}
    setLga(value?.lgas)
    setFormValues((prevState) => {
      return {
        ...prevState,
        state: value?.state,
      }
    })
  }

  const handleLgaData = (data) => {
    const { value } = data || {}
    setFormValues((prevState) => {
      return {
        ...prevState,
        localGovt: value,
      }
    })
  }

  const handleDataFromDropDown = (data) => {
    const { value } = data || {}
    setFormValues((prevState) => {
      return {
        ...prevState,
        incidentType: value,
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
          <div className="form-group">
            <StateDropDown label={"State"} dataToComponent={handleStateData}/>
          </div> 
        
            <div className="form-group">
              <LGADropDown
                label={"LGA"}
                lgaData={lga}
                dataToComponent={handleLgaData}
              />
            </div>
            <div className="form-group">
              <IncidentType
                label={"Incident Type"}
                dataToComponent={handleDataFromDropDown}
              />
            </div> 

            <input
                className="form-control"
                type="text"
                name="name"
                placeholder="Date"
                onClick={() => setShowModal(true)}
                value={formValues.date}
                readOnly
              />
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
