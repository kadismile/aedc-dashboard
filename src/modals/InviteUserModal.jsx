import { useState } from 'react';
import { Modal } from 'react-bootstrap';
import toastr from 'toastr';
import { LoadingButton, SubmitButton } from "../components/elements/Buttons"
import '../styles/custom.css';
import { DepartmentDropDown } from '../components/elements/DepartmentDropDown';
import { userService } from '../services/userService';
import isEmail from 'validator/lib/isEmail';
import { RespondersDropDown } from '../components/elements/RespondersDropDown';

export const InviteUserModal = (props) => {
  const RESPONDER_DEPARTMENT = process.env.REACT_APP_RESPONDER_DEPARTMENT
  const formFields = {
    email: '',
    department: '',
    agency: ''
  };

  const [submitForm, setSubmitForm] = useState(false);
  const [showAgency, setShowAgency] = useState(false)

  const [formValues, setFormValues] = useState({
    ...formFields,
    errors: formFields,
  });

  const [loading, setLoading] = useState(false);

  const failedValidation = () => {
    const { email, department } = formValues
    if (email?.length < 3 || !isEmail(email)) {
      return true
    }
    if (department?.length < 3) {
      return true
    }

    return false
  }

  const formErrorMessage = (value) => {
    const {department, email} = formValues
    
    if (value === 'department') {
      if (submitForm && department.length < 1 ) {
        return 'Department is mandatory'
      }
    }

    if (value === 'email') {
      if (submitForm && (email.length < 3 || !isEmail(email) )) {
        return 'Email is in-correct'
      }
    }
  }

  const handleChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    setFormValues((prevState) => {
      return {
        ...prevState,
        
        [name]: value,
      };
    });
  };

  const handleSubmit = async (event) => {
    setSubmitForm(true)
    event.preventDefault();
    if (failedValidation()) return
    setLoading(true);
    const { email, department, agency } = formValues;
    const response = await userService.inviteUser({ email, department, agency })
    const { status } = response
    if (status === 'failed') {
      toastr.error('Cannot Invite User');
      setTimeout(() => setLoading(false), 1000)
    } else {
      toastr.success('User Invitation was  Successful');
      setTimeout(() => setLoading(false), 1000)
      props.onHide()
    }
  };

  const handleDataFromDropDown = (data) => {
    const {label, value } = data
    if (label === 'Responder') {
      setShowAgency(true)
    }
    setFormValues((prevState) => {
      return {
        ...prevState,
        department: label !== 'Responder' && label !== 'Agency'  ? value : formValues.department || RESPONDER_DEPARTMENT,
        agency: label === 'Agency' ? value : formValues.agency,
      };
    });
  }

  return (
    <Modal
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={props.show}
      onHide={() => props.onHide()}
    >
      <Modal.Header closeButton>
        
      </Modal.Header>
      <Modal.Body>
          <div className="text-center">
            <h4 className="mt-10 mb-5 text-brand-1">Invite User</h4>
          </div>
          <form className="login-register text-start mt-20" action="#">
            <div className="form-group">
              <label className="form-label" htmlFor="input-1">
                Email of User
              </label>
              <input
                className="form-control"
                id="input-1"
                type="text"
                name="email"
                placeholder="email of user to be invited"
                onChange={handleChange}
                value={formValues.email}
              />
              {<span className="form_errors"> { formErrorMessage('email') } </span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="input-1">
                Department
              </label>
              <DepartmentDropDown
                  label={"Incident Type"}
                  dataToComponent={handleDataFromDropDown}
              />
              { <span className="form_errors"> { formErrorMessage('department') } </span>}
            </div>

            {
              showAgency &&
              <div className="form-group">
              <label className="form-label" htmlFor="input-1">
                Agency
              </label>
              <RespondersDropDown
                  label={"Agency"}
                  dataToComponent={handleDataFromDropDown}
              />
              { <span className="form_errors"> { formErrorMessage('agency') } </span>}
            </div> 
            }
            
            <div className="form-group">
              { !loading ? (
                <SubmitButton
                  onClick={handleSubmit}
                  title={"Send Invite"}
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
