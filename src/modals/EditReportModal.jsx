import { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import toastr from 'toastr';
import { DisabledButton, LoadingButton, SubmitButton } from "../components/elements/Buttons"
import { crudService } from '../services/crudService';
import BooleanDropDown from "../components/elements/BooleanDropDown";
import StateDropDown from "../components/elements/NigerianStates"
import LGADropDown from "../components/elements/LGADropDown"
import { prepareAddresss } from '../utils/address-helper';
export const EditReportModal = (props) => {
  const { data: { description = '' } = {} } = props;
  const {user: { _id = '_id' } = {} } = props
  const formFields = {
    resolved: '',
    numberKilled: '',
    numberInjured: '',
    numberDisplaced: '',
    state: undefined,
    localGovt: undefined,
    fullAddress: '',
    description: ''
  };

  const [submitForm, setSubmitForm] = useState(false);

  const [formValues, setFormValues] = useState({
    ...formFields,
    errors: formFields,
  });

  const [loading, setLoading] = useState(false);
  const [lga, setLga] = useState(["select a state"])

  const disableForm = () => {
    const newValues = { ...formValues };
    let isError = false;
    for (let val of Object.values(newValues)) {
      if (val === "") {
        isError = true;
      }
    }
    if (isError && submitForm) {
      return true;
    }
    if (!isError && !submitForm) {
      return true;
    }
    if (isError && !submitForm) {
      return true;
    }
    if (!isError && !submitForm) {
      return false;
    }
  };

  const validateForm = (name, errors, value) => {
    switch (name) {
      case "name":
        errors.name = "";
        if (!value.length) {
          errors.name = "pls add name";
          setSubmitForm(false);
        } else {
          setSubmitForm(true);
        }
        return errors.name;
      default:
        setSubmitForm(false);
        break;
    }
  };

  const handleChange = (event) => {
      event.preventDefault();
      let { name, value } = event.target;
      let errors = formValues.errors;
      validateForm(name, errors, value);
      setFormValues((prevState) => {
        return {
          ...prevState,
          errors,
          [name]: value,
        };
      });
      for (let val of Object.values(formValues.errors)) {
        if (val !== "") {
          setSubmitForm(false);
        }
      }
  };

  const handleDropDownData = (data) => {
    const { label, value } = data
    const { resolved } = formValues
    const errors = formValues.errors;
    setFormValues((prevState) => {
      return {
        ...prevState,
        errors,
        resolved: label === 'Intervention' ? value : resolved,
      };
    });
  };

  const handleStateData = (data) => {
    const { value } = data || {}
    const errors = formValues.errors
    setLga(value?.lgas)
    setFormValues((prevState) => {
      return {
        ...prevState,
        errors,
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const { state, localGovt, fullAddress, resolved, numberDisplaced,
      numberInjured, numberKilled, description
    } = formValues;

    const prepAddress =  await prepareAddresss(fullAddress + ' ' + state)
    if (!prepAddress) {
      toastr.error('Kindly check the address entered');
      return 
    }
    const { country, countryCode, latitude, longitude } = prepAddress
    const finalAddress = { country, countryCode,userTypedAddress: fullAddress,
      state, localGovt, fullAddress: prepAddress.fullAddress, latitude, longitude
    }

    const response = await crudService.editReport({
      reportId:props.data._id, userId: _id,
      resolved, numberDisplaced,finalAddress,
      numberInjured, numberKilled, description 
    })
    const { status } = response
    if (status === 'failed') {
      toastr.error('Cannot Update Report');
      setTimeout(() => setLoading(false), 1000)
    } else {
      toastr.success('Report Updated Successfully');
      setTimeout(() => setLoading(false), 1000)
      props.onHide({updated: true})
    }
  };

  useEffect(() => {
    if (description) {
      const initialErrors = {};
      Object.keys(formFields).forEach((key) => {
        initialErrors[key] = '';
      });
      setFormValues((prevState) => {
        return {
          ...prevState,
          description,
        };
      });
    }
  }, [description]);



  return (
    <Modal
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={props.show}
      onHide={props.onHide}
      size="xl"
    >
      <Modal.Header closeButton>
        
      </Modal.Header>
      <Modal.Body style={{padding: '3rem'}}>
          <div className="text-center">
            <h2 className="mt-10 mb-5 text-brand-1">Edit Report</h2>
          </div>

          <div className="row">
              <div className="col-lg-12">
                <div className="row">
                  <div className="col-lg-3 col-md-6">
                    <div className="form-group "> 
                      <label  htmlFor="input-1">Numbers Killed</label>
                      <input 
                        className="form-control" 
                        name="numberKilled"
                        style={{lineHeight: '0.5'}} 
                        type="number" 
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="col-lg-3 col-md-6">
                    <div className="form-group"> 
                      <label htmlFor="input-1">Numbers Injured</label>
                      <input 
                        className="form-control" 
                        name="numberInjured" 
                        style={{lineHeight: '0.5'}} 
                        type="number" 
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="col-lg-3 col-md-6">
                    <div className="form-group"> 
                      <label  htmlFor="input-1">Numbers Displaced</label>
                      <input 
                        className="form-control" 
                        name="numberDisplaced"  
                        style={{lineHeight: '0.5'}} 
                        type="number"  
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="col-lg-3 col-md-6">
                    <div className="form-group"> 
                      <label htmlFor="input-1">Has this happened before ?</label>
                      <BooleanDropDown label={'Intervention'} dataToComponent={ handleDropDownData }/>
                    </div>
                  </div>

                </div>

                <div className="row">
                  <div className="col-lg-4 col-md-6">
                    <div className="form-group"> 
                      <label  htmlFor="input-1">State</label>
                      <StateDropDown label={"State"} fetchFromstore={false} dataToComponent={handleStateData}/>
                    </div>
                  </div>

                  <div className="col-lg-4 col-md-6">
                    <div className="form-group mb-30"> 
                      <label  htmlFor="input-1">Local Govt.</label>
                      <LGADropDown
                        label={"LGA"}
                        lgaData={lga}
                        fetchFromstore={false}
                        dataToComponent={handleLgaData}
                      />
                    </div>
                  </div>

                  <div className="col-lg-4 col-md-6">
                    <div className="form-group mb-30"> 
                      <label className="fform-label" htmlFor="input-1">Address</label>
                      <input 
                        className="form-control" 
                        name="fullAddress" 
                        type="text"  
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                </div>
                <div className="row">
                  <div className="col-lg-12">
                    <div className="form-group mb-30"> 
                      <label className="form-label" htmlFor="input-1">Description</label>
                      <textarea class="form-control"
                        name="description" 
                        style={{lineHeight: 1.5}}
                        rows="8"
                        onChange={handleChange}
                        value={formValues.description}
                      ></textarea>
                    </div>
                </div>

                  <div className="form-group">
              
             
                <SubmitButton
                  onClick={handleSubmit}
                  title={"Submit"}
                  className={"btn btn-brand-1 w-100"}
                />
              
            </div>
                  

                </div>
              </div>
          </div>


          
      
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  );
};
