import { useState } from 'react';
import { Modal } from 'react-bootstrap';
import toastr from 'toastr';
import { DisabledButton, LoadingButton, SubmitButton } from "../components/elements/Buttons"
import { crudService } from '../services/crudService';


export const AddVendorModal = (props) => {
  const formFields = {
    name: '',
    phoneNumber: '',
    address: '',
  };

  const [submitForm, setSubmitForm] = useState(false);

  const [formValues, setFormValues] = useState({
    ...formFields,
    errors: formFields,
  });

  const [loading, setLoading] = useState(false);

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

      case "address":
        errors.address = "";
        if (value.length && value.length <= 1) {
          errors.address = "address must be more than 3 characters long!";
          setSubmitForm(false);
        } else {
          setSubmitForm(true);
        }
        return errors.address;

      case "phoneNumber":
        errors.phoneNumber = "";
          if (value.length && value.length <= 10) {
            errors.phoneNumber = "Phone Number must be more than 10 characters long!";
            setSubmitForm(false);
          } else {
            setSubmitForm(true);
          }
          return errors.phoneNumber;  

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

  const handleSubmit = async (event) => {
    props.onHide({ addVendor: true })
    event.preventDefault();
    setLoading(true);
    const { name, phoneNumber, address } = formValues;
    const response = await crudService.addVendor({
      name, phoneNumber, address
    })
    const { status } = response
    if (status === 'failed') {
      toastr.error('Cannot Update Department');
      setTimeout(() => setLoading(false), 1000)
    } else {
      toastr.success('Login Successfully');
      setTimeout(() => setLoading(false), 1000)
      props.onHide({ addVendor: true })
    }
  };

  return (
    <Modal
      aria-labelledby="contained-modal-title-vcenter"
      show={props.show}
      onHide={() => props.onHide({addVendor: true})}
    >
      <Modal.Header closeButton>
        
      </Modal.Header>
      <Modal.Body>
          <div className="text-center">
            <h2 className="mt-10 mb-5 text-brand-1">Add Vendor</h2>
          </div>
          <form className="login-register text-start mt-20" action="#">
            <div className="form-group">
              <label className="form-label" htmlFor="input-1">
                Name of Vendor *
              </label>
              <input
                className="form-control"
                id="input-1"
                type="text"
                name="name"
                placeholder="name"
                onChange={handleChange}
                value={formValues.name}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="input-4">
                Phone Number *
              </label>
              <input
                className="form-control"
                type="text"
                name="phoneNumber"
                placeholder="phone number"
                onChange={handleChange}
                value={formValues.phoneNumber}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="input-4">
               Address *
              </label>
              <input
                className="form-control"
                type="text"
                name="address"
                placeholder="address"
                onChange={handleChange}
                value={formValues.address}
              />
            </div>
            
            <div className="form-group">
              {disableForm() ? (
                <DisabledButton
                  title={"Submit"}
                  className={"btn btn-brand-1 w-100"}
                />
              ) : !loading ? (
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
