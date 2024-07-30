import { useState, useEffect } from 'react';
import { useDispatch } from "react-redux";
import { resetStaff } from "../redux/staff-slice";
import { Modal } from 'react-bootstrap';
import toastr from 'toastr';
import { DisabledButton, LoadingButton, SubmitButton } from "../components/elements/Buttons"
import { userService } from '../services/userService';
export const ChangePasswordModal = (props) => {
  const dispatch = useDispatch();
  const formFields = {
    oldPassword: '',
    newPassword: '',
    repeatNewPassword: '',
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
      case "oldPassword":
        errors.oldPassword = "";
        if (!value.length && value.length < 5) {
          errors.oldPassword = "pls add a password";
          setSubmitForm(false);
        } else {
          setSubmitForm(true);
        }
        return errors.oldPassword;
      case "newPassword":
          errors.newPassword = "";
          if (!value.length && value.length < 5) {
            errors.newPassword = "pls add a new password";
            setSubmitForm(false);
          } else {
            setSubmitForm(true);
          }
          return errors.newPassword;  
        case "repeatNewPassword":
            errors.repeatNewPassword = "";
            if (!value.length && value.length < 5 ) {
              errors.repeatNewPassword = "kindly input your new password";
              setSubmitForm(false);
            } else if (value !== formValues.newPassword) {
              errors.repeatNewPassword = "password mismatch";
              setSubmitForm(false);
            }
            else {
              setSubmitForm(true);
            }
            return errors.repeatNewPassword;    
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
    event.preventDefault();
    setLoading(true);
    const { oldPassword, newPassword } = formValues;
    const response = await userService.changePassword({
      oldPassword,
      newPassword
    })
    const { status, error } = response
    if (status === 'failed') {
      toastr.error(error);
      setTimeout(() => setLoading(false), 1000)
      dispatch( resetStaff() );
      window.location.replace("/");
    } else {
      toastr.success('Login Successfully');
      setTimeout(() => setLoading(false), 1000)
      props.onHide()
      dispatch( resetStaff() );
      window.location.replace("/");
    }
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
            <h3 className="mt-10 mb-5 text-brand-1">Change Password</h3>
          </div>
          <form className="login-register text-start mt-20" action="#">
            <div className="form-group">
              <label className="form-label" htmlFor="input-1">
                Current Password *
              </label>
              <input
                className="form-control"
                id="input-1"
                type="password"
                name="oldPassword"
                placeholder="current password"
                onChange={handleChange}
                value={formValues.oldPassword}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="input-1">
                New Password *
              </label>
              <input
                className="form-control"
                id="input-1"
                type="password"
                name="newPassword"
                placeholder="new password"
                onChange={handleChange}
                value={formValues.newPassword}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="input-1">
                Retype New Password *
              </label>
              <input
                className="form-control"
                id="input-1"
                type="password"
                name="repeatNewPassword"
                placeholder="new password"
                onChange={handleChange}
                value={formValues.repeatNewPassword}
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
