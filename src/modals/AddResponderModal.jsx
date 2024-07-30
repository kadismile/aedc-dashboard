import { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import toastr from 'toastr';
import { LoadingButton, SubmitButton } from "../components/elements/Buttons"
import { crudService } from '../services/crudService';
import '../styles/custom.css';
export const AddResponderModal = (props) => {
  const formFields = {
    name: '',
    email: '',
    phoneNumber: '',
  };

  const [submitForm, setSubmitForm] = useState(false);

  const [formValues, setFormValues] = useState({
    ...formFields,
    errors: formFields,
  });

  const [loading, setLoading] = useState(false);

  const failedValidation = () => {
    const { email, name, phoneNumber } = formValues
    if (name.length < 3) {
      return true
    }
    if (email.length < 3) {
      return true
    }
    if (phoneNumber.length < 10) {
      return true
    }

    return false
  }

  const formErrorMessage = (value) => {
    const {name, phoneNumber, email} = formValues
    if (value === 'name') {
      if (submitForm && name.length < 3 ) {
        return 'Name is too short'
      }
    }

    if (value === 'phoneNumber') {
      if (submitForm && phoneNumber.length < 10 ) {
        return 'Phone Number is in-correct'
      }
    }

    if (value === 'email') {
      if (submitForm && email.length < 3 ) {
        return 'Email is in-correct'
      }
    }
  }

  const handleChange = (event) => {
      event.preventDefault();
      let { name, value } = event.target;
      let errors = formValues.errors;
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

  const handleSubmit = async (event) => {
    setSubmitForm(true)
    event.preventDefault();
    if (failedValidation()) return
    setLoading(true);
    const { name, email, phoneNumber } = formValues;
    const response = await crudService.addAgency({ name, email, phoneNumber })
    const { status } = response
    if (status === 'failed') {
      toastr.error('Cannot Create Responder');
      setTimeout(() => setLoading(false), 1000)
    } else {
      toastr.success('Responder Creation was  Successful');
      setTimeout(() => setLoading(false), 1000)
      props.onHide({addAgency: true})
    }
  };

  return (
    <Modal
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={props.show}
      onHide={() => props.onHide({addAgency: true})}
    >
      <Modal.Header closeButton>
        
      </Modal.Header>
      <Modal.Body>
          <div className="text-center">
            <h4 className="mt-10 mb-5 text-brand-1">Add Responder</h4>
          </div>
          <form className="login-register text-start mt-20" action="#">
            <div className="form-group">
              <label className="form-label" htmlFor="input-1">
                Name of Responder 
              </label>
              <input
                className="form-control"
                id="input-1"
                type="text"
                name="name"
                placeholder="name of responder"
                onChange={handleChange}
                value={formValues.name}
              />
              {<span className="form_errors"> { formErrorMessage('name') }</span> }
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="input-1">
                Email of Responder
              </label>
              <input
                className="form-control"
                id="input-1"
                type="text"
                name="email"
                placeholder="email of responder"
                onChange={handleChange}
                value={formValues.email}
              />
              {<span className="form_errors"> { formErrorMessage('email') } </span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="input-1">
                Phone Number
              </label>
              <input
                className="form-control"
                id="input-1"
                type="text"
                name="phoneNumber"
                placeholder="phone-number of responder"
                onChange={handleChange}
                value={formValues.phoneNumber}
              />
              { <span className="form_errors"> { formErrorMessage('phoneNumber') } </span>}
            </div>
            
            <div className="form-group">
              { !loading ? (
                <SubmitButton
                  onClick={handleSubmit}
                  title={"Submit"}
                  className={"btn btn-brand-1 w-100"}
                />
              ) : (
                <LoadingButton />
              )}
            </div>
            
          </form>
      
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  );
};
