import {useState} from 'react'
import { store } from '../redux/store';
import { Modal } from 'react-bootstrap';
import { SubmitButton } from '../components/elements/Buttons';
import { reportService } from '../services/reportsService';
import toastr from 'toastr';
import Select from 'react-select';
import { formErrorMessage } from '../helpers/form-error-messages';
import { MultiRespondersDropDown } from '../components/elements/MultiResponders';


export const VerifyReportModal = (props) => {
  let user = store?.getState()?.user?.user
  if (user) {
    user = user.user
  }

  const [submitForm, setSubmitForm] = useState(false);
  const [formValues, setFormValues] = useState({
      comments: undefined,
      verMethod: undefined,
      reportStatus: undefined,
      camsVeriMethod: undefined,
      camsVeriOptions: undefined,
      responder: undefined,
      addminReportType: undefined,
  });

  const verificationOptions = () => {
      return [
      {
        value: 'verified',
        label: 'verified'
      },
      {
        value: 'false-report',
        label: 'false-report'
      },
      {
        value: 'returned',
        label: 'returned'
      }
    ]
  }

  const reportType = () => {
    return [
    {
      value: 'incident',
      label: 'incident'
    },
    {
      value: 'conflict',
      label: 'conflict'
    },
  ]
}

  const verificationMethods = () => {
    return [
      {
        value: 'sms',
        label: 'sms'
      },
      {
        value: 'phone calls',
        label: 'phone calls'
      },
      {
        value: 'emails',
        label: 'emails'
      },
    ]
  }

  const responderVerificationMethods = () => {
    return [
      {
        value: 'Dialog',
        label: 'Dialog'
      },
      {
        value: 'Use of Force',
        label: 'Use of Force'
      },
      {
        value: 'Arrest',
        label: 'Arrest'
      },
    ]
  }

  const reportStatusMethods = () => {
    return [
      {
        value: 'Resolved',
        label: 'Resolved'
      },
      {
        value: 'Unresolved',
        label: 'Unresolved'
      },
      {
        value: 'Processing',
        label: 'Processing'
      },
    ]
  }

  const customStyles = {
    input: (provided) => ({
      ...provided,
      width: 100,
      height: 38,
      display: 'flex',
      alignItems: 'center',
    }),
    singleValue: (provided) => ({
      ...provided,
      marginTop: 2,
    }),
  };


  const handleChange = (event) => {
    event.preventDefault();
    let { name, value } = event.target;
    setFormValues((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  const handleMethodClick = async (data) => {
    const { verMethod, camsVeriMethod, camsVeriOptions, reportStatus, responder, addminReportType } = formValues
    const { value, label } = data
    setFormValues((prevState) => {
      return {
        ...prevState,
        verMethod: label === 'Dialog' || label === 'Use of Force' || label === 'Arrest' ? value : verMethod,
        reportStatus: label === 'Resolved' || label === 'Unresolved' || label === 'Processing' ? value : reportStatus,
        camsVeriMethod: label === 'sms' || label === 'phone calls' || label === 'emails' ? value : camsVeriMethod,
        camsVeriOptions: label === 'verified' || label === 'false-report' || label === 'returned' ? value : camsVeriOptions,
        responder: label === 'Responders' ? value : responder,
        addminReportType: label === 'incident' ? value : addminReportType,
      };
    });
  }

  const failedValidation = () => {
    const { 
      comments, camsVeriOptions, camsVeriMethod, 
      responder, verMethod, reportStatus
    } = formValues

    if (props.depAcronym === 'CAMS') {
      if (comments?.length < 10 ||  !camsVeriOptions || !camsVeriMethod ) {
        return true
      }
    }

    if (props.depAcronym === 'CPS') {
      if (comments?.length < 10 ||  !responder) {
        return true
      }
    }

    if (props.depAcronym === 'Responder') {
      if (comments?.length < 10 ||  !verMethod || !reportStatus) {
        return true
      }
    }
    
    return undefined
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitForm(true)
    if (failedValidation()) {
      return;
    }
    const { 
      comments, 
      responder, 
      camsVeriMethod, 
      verMethod, 
      reportStatus, 
      camsVeriOptions,
      addminReportType
    } = formValues

    const data = {
      reportId: props.data,
      verified: camsVeriMethod,
      userId: user._id,
      verificationMethod: camsVeriOptions,
      comments,
      responderVeriMethod: verMethod,
      reportStatus,
      responder,
      addminReportType
    }
    const response = await reportService.verifyReport(data)
    const { message } = response
    toastr.success(message, { timeOut: 6000 });
    props.onHide({closeVerifyModal: true })
  }

  const closeModal = () => {
    props.onHide({closeVerifyModal: true })
  }

  return (
    <Modal
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={props.show}
      onHide={closeModal}
      size="md"
    >
      <Modal.Header closeButton>
        
      </Modal.Header>
      <Modal.Body>
        <div className="text-center">
            <h5 className="mt-10 mb-5 text-brand-1">{props.title}</h5>
          </div>
        <div className="form-group">
        <form className="login-register text-start mt-20" action="#">
          {
            props.depAcronym === 'CAMS' &&
          <>
              <Select
                styles={customStyles}
                defaultValue={{ label: 'Verification Method', value: '' }}
                onChange={ handleMethodClick }
                options={ verificationMethods() }
                className={'select-react'}
              />
              { formErrorMessage('camsVeriMethod', formValues, submitForm)}
              <br/>
              <br/>

              <Select
                styles={customStyles}
                defaultValue={{ label: 'Verify Report', value: '' }}
                onChange={ handleMethodClick }
                options={ verificationOptions() }
                className={'select-react'}
              />
              { formErrorMessage('camsVeriOptions', formValues, submitForm) }
              <br/>
              <br/>

              <Select
                styles={customStyles}
                defaultValue={{ label: 'Type of Report', value: '' }}
                onChange={ handleMethodClick }
                options={ reportType() }
                className={'select-react'}
              />
              { formErrorMessage('camsVeriOptions', formValues, submitForm) }
              <br/>
              <br/>
              </>
            }

            {
              props.depAcronym === 'Responder' &&
            <>
              <Select
                styles={customStyles}
                defaultValue={{ label: 'Response Method', value: '' }}
                onChange={ handleMethodClick }
                options={ responderVerificationMethods() }
                className={'select-react'}
              />
              { formErrorMessage('verMethod', formValues, submitForm)}
              <br/>
              <br/>

              <Select
                styles={customStyles}
                defaultValue={{ label: 'Situation Report', value: '' }}
                onChange={ handleMethodClick }
                options={ reportStatusMethods() }
                className={'select-react'}
              />
              { formErrorMessage('reportStatus', formValues, submitForm)}
              <br/>
              <br/>
            </>
            }
            
            <div className="form-group">
              <label className="form-label" htmlFor="input-1">
                Comments*
              </label>
              <div class="form-group mb-30"> 
                <textarea class="form-control"
                  name="comments" 
                  rows="4" cols="50"
                  onChange={handleChange}
                  value={formValues.comments}
                >
                </textarea>
                { formErrorMessage('comments', formValues, submitForm)}
              </div>
            </div>

            { props.depAcronym === 'CPS' &&
            <>
              <MultiRespondersDropDown dataToComponent={handleMethodClick} label={"Responders"}/>
              { formErrorMessage('responder', formValues, submitForm)}
            </>
            }

            <br/>
            <br/>
            <div className="form-group">
              <SubmitButton
                onClick={handleSubmit}
                title={"Submit"}
                className={"btn btn-brand-1 w-100"}
              />
            </div>
            
          </form>
          
        </div>
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  );
}