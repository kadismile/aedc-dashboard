import { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import toastr from 'toastr';
import { DisabledButton, LoadingButton, SubmitButton } from "../components/elements/Buttons"
import { crudService } from '../services/crudService';
export const GoogleSearchModal = (props) => {
  const formFields = {
    searchParams: ''
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
      case "searchParams":
        errors.searchParams = "";
        if (!value.length) {
          errors.searchParams = "pls add search parameter";
          setSubmitForm(false);
        } else {
          setSubmitForm(true);
        }
        return errors.searchParams;
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
    props.onHide()
    event.preventDefault();
    setLoading(true);
    const { searchParams } = formValues;
    toastr.success('Check the next Window for your google feeds');
    const url = `https://news.google.com/search?q=${searchParams}&hl=en-NG&gl=NG&ceid=NG%3Aen`
    window.open(url, '_blank');
    setLoading(false);
    props.onHide()
  };

  return (
    <Modal
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={props.show}
      onHide={props.onHide}
    >
      <Modal.Header closeButton>
        
      </Modal.Header>
      <Modal.Body>
          <div className="text-center">
            <h4 className="mt-10 mb-5 text-brand-1">Search Google News</h4>
          </div>
          <form className="login-register text-start mt-20" action="#">
            <div className="form-group">
              <label className="form-label" htmlFor="input-1">
                Search Params *
              </label>
              <input
                className="form-control"
                id="input-1"
                type="text"
                name="searchParams"
                placeholder="search parameters"
                onChange={handleChange}
                value={formValues.searchParams}
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
