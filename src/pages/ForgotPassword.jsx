import { useState } from "react";
import { Link } from "react-router-dom";
import { DisabledButton, LoadingButton, SubmitButton } from "../components/elements/Buttons"
import { userService } from '../services/userService'
import toastr from 'toastr'
import { useDispatch } from "react-redux";
import { setStaff } from "../redux/staff-slice";

export const ForgotPassword = () => {

  const dispatch = useDispatch();
  const formFields = {
    email: "",
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
      case "email":
        errors.email = "";
        if (!value.length) {
          errors.email = "pls add email";
          setSubmitForm(false);
        } else {
          setSubmitForm(true);
        }
        return errors.email;
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
    const { email } = formValues;
    const response = await userService.sendResetPassEmail(email)
    const { status, message } = response
    if (status === 'failed') {
      toastr.error(message);
      setTimeout(() => setLoading(false), 1000)
    } else {
      const { token, user } = response
      toastr.success(message);
      setTimeout(() => setLoading(false), 1000)
      dispatch(setStaff({ token, user }));
      window.location.replace("/");
    }
  };


  return (
    <>
      <div className="box-content">
        <div className="row"> 
          <div className="col-lg-12"> 
            <div className="section-box">
              <div className="container"> 
                <div className="panel-white mb-30">
                  <div className="box-padding">               
                    <div className="login-register"> 
                      <div className="row login-register-cover pb-250">
                        <div className="col-lg-4 col-md-6 col-sm-12 mx-auto">
                          <div className="form-login-cover">
                            <div className="text-center">
                              <h3 className="mt-10 mb-5 text-brand-1">Forgot Password?</h3>
                            </div>
                            <form className="login-register text-start mt-20" action="#">
                              <div className="form-group">
                                <label className="form-label" htmlFor="input-1">Email address *</label>
                                <input 
                                  className="form-control" 
                                  id="input-1" type="text" 
                                  name="email" 
                                  placeholder="yourname@gmail.com"
                                  onChange={handleChange}
                                  value={formValues.email}
                                />
                              </div>
                              
                              <div className="form-group">
                              {
                                disableForm() ? (
                                  <DisabledButton title={'Submit'} className={'btn btn-brand-1 w-100'}/>
                                ) : !loading ? (
                                  <SubmitButton onClick={ handleSubmit } title={'Submit'} className={'btn btn-brand-1 w-100'}/>
                                ) : (
                                  <LoadingButton />
                                )
                              }
                              </div>
                              <div className="login_footer form-group d-flex justify-content-between">
                                
                                <Link className='text-muted' to="/login">
                                    Back to Login
                                </Link> 
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
      
      
      </div>
    </>
  )
}