import { useState } from "react";
import { Link } from "react-router-dom";
import { DisabledButton, LoadingButton, SubmitButton } from "../components/elements/Buttons"
import { userService } from '../services/userService'
import toastr from 'toastr'
import { useDispatch } from "react-redux";
import { setStaff } from "../redux/staff-slice";
import { useNavigate } from 'react-router-dom';

export const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const formFields = {
    email: "",
    password: ""
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
      case "password":
        errors.password = "";
        if (value.length && value.length <= 3) {
          errors.password = "password must be more than 3 characters long!";
          setSubmitForm(false);
        } else {
          setSubmitForm(true);
        }
        return errors.password;

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
    const { email, password } = formValues;
    const response = await userService.loginUser(email, password)
    const { status } = response
    if (status === 'failed') {
      toastr.error('Invalid Login Details');
      setTimeout(() => setLoading(false), 1000)
    } else {
      const { token, staff } = response
      toastr.success('Login Successfully');
      setTimeout(() => setLoading(false), 1000)
      dispatch(setStaff({ token, staff }));
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
                              <img src="/images/aedc_logo.png" alt="log" />
                              <h2 className="mt-10 mb-5 text-brand-1">Staff Login</h2>
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
                                <label className="form-label" htmlFor="input-4">Password *</label>
                                <input className="form-control" 
                                type="password" 
                                name="password" 
                                placeholder="************"
                                onChange={handleChange}
                                value={formValues.password}
                              />
                              </div>
                              <div className="login_footer form-group d-flex justify-content-between">
                                <Link className='text-muted' to="/user/register">
                                    Register
                                </Link> 
                                <Link className='text-muted'  to="/forgot-password">
                                    Forgot Password
                                </Link> 
                              </div>
                              <div className="form-group">
                              {
                                disableForm() ? (
                                  <DisabledButton title={'Login'} className={'btn btn-brand-1 w-100'}/>
                                ) : !loading ? (
                                  <SubmitButton onClick={ handleSubmit } title={'Login'} className={'btn btn-brand-1 w-100'}/>
                                ) : (
                                  <LoadingButton />
                                )
                              }
                                
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