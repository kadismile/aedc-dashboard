import { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import toastr from 'toastr';
import { DisabledButton, LoadingButton, SubmitButton } from "../components/elements/Buttons"
import { crudService } from '../services/crudService';
export const EditDeptModal = (props) => {
  const {data: { name, acronym, _id }} = props
  const formFields = {
    name,
    acronym
  };

  const [submitForm, setSubmitForm] = useState(false);

  const [formValues, setFormValues] = useState({
    ...formFields,
    errors: formFields,
  });

  const [loading, setLoading] = useState(false);


  useEffect(() => {
    if (name && acronym) {
      const initialErrors = {};
      Object.keys(formFields).forEach((key) => {
        initialErrors[key] = '';
      });
      setFormValues({
        ...formFields, 
        errors: initialErrors })
    }
    return () => {
      console.log('dead com')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, acronym]);

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
      case "acronym":
        errors.acronym = "";
        if (value.length && value.length <= 1) {
          errors.acronym = "acronym must be more than 3 characters long!";
          setSubmitForm(false);
        } else {
          setSubmitForm(true);
        }
        return errors.acronym;

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
    props.onHide({editDept: true})
    event.preventDefault();
    setLoading(true);
    const { name, acronym } = formValues;
    const response = await crudService.editDept({
      _id,
      name,
      acronym
    })
    const { status } = response
    if (status === 'failed') {
      toastr.error('Cannot Update Department');
      setTimeout(() => setLoading(false), 1000)
    } else {
      toastr.success('Login Successfully');
      setTimeout(() => setLoading(false), 1000)
      props.onHide({editDept: true})
    }
  };

  return (
    <Modal
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={props.show}
      onHide={() => props.onHide({editDept: true})}
    >
      <Modal.Header closeButton>
        
      </Modal.Header>
      <Modal.Body>
          <div className="text-center">
            <h2 className="mt-10 mb-5 text-brand-1">Edit Department</h2>
          </div>
          <form className="login-register text-start mt-20" action="#">
            <div className="form-group">
              <label className="form-label" htmlFor="input-1">
                Name of Department *
              </label>
              <input
                className="form-control"
                id="input-1"
                type="text"
                name="name"
                placeholder="name of department"
                onChange={handleChange}
                value={formValues.name}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="input-4">
                Acronym *
              </label>
              <input
                className="form-control"
                type="text"
                name="acronym"
                placeholder="acronym"
                onChange={handleChange}
                value={formValues.acronym}
              />
            </div>
            
            <div className="form-group">
              {disableForm() ? (
                <DisabledButton
                  title={"Update"}
                  className={"btn btn-brand-1 w-100"}
                />
              ) : !loading ? (
                <SubmitButton
                  onClick={handleSubmit}
                  title={"Update"}
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
