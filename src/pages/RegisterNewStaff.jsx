import { useState, useEffect } from "react";
import { SubmitButton } from "../components/elements/Buttons"
import { userService } from '../services/userService'
import toastr from 'toastr'
import { PageLoader } from "../components/elements/spinners";
import { VendorDropDown } from "../components/elements/VendorDropDown";
import { StaffTypeDropDown } from "../components/elements/StaffTypeDropDown";
import { StateDropDown } from "../components/elements/StateDropDown";

export const RegisterNewStaff = () => {
  const [submitForm, setSubmitForm] = useState(true);
  const [isInstaller, setIsInstaller] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(()=> {
    setTimeout(() => setLoading(false), 500)
  }, [])

  const [formValues, setFormValues] = useState({
    email: '',
    phoneNumber: '',
    role: '',
    staffRegion: '',
    vendor: undefined,
    fullName: '',
    password: '',
    repeatPassword: '',
  });

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

  const failedValidation = () => {
    if (submitForm === true) {
      if (formErrorMessage('fullName')?.length || formErrorMessage('phoneNumber')?.length
      || formErrorMessage('password')?.length || formErrorMessage('repeatPassword')?.length 
      || formErrorMessage('phoneNumber')?.length) {
        return false
      }
      return true 
    }
    return false
  }

  const formErrorMessage = (value) => {
    const { fullName, phoneNumber, email, password, role, staffRegion, vendor, repeatPassword} = formValues
    if (value === 'fullName') {
      if (submitForm && fullName.length < 3 ) {
        return 'full Name is required'
      }
    }

    if (value === 'password') {
      if (submitForm && password?.length < 5 ) {
        return 'password is too short'
      }
    }

    if (value === 'phoneNumber') {
      if (submitForm && phoneNumber?.length < 10 ) {
        return 'phone number is incorrect'
      }
    }

    if (value === 'role') {
      if (submitForm && role?.length < 1 ) {
        return 'role is required'
      }
    }

    if (value === 'vendor') {
      if (submitForm && vendor?.length < 1 ) {
        return 'vendor is required'
      }
    }

    if (value === 'staffRegion') {
      if (submitForm && staffRegion?.length < 1 ) {
        return 'Staff Region is required'
      }
    }

    if (value === 'email') {
      if (submitForm && email?.length < 2 ) {
        return 'email is required'
      }
    }

    if (value === 'repeatPassword') {
      if (submitForm && repeatPassword?.length < 5 ) {
        return 'repeated password is too short'
      }
      if (submitForm && repeatPassword !== password ) {
        return 'repeated password must be same with password'
      }
    }
  }

  const handleStaffTypeDropDown = (data) => {
    const { value, label } = data
    if (label === 'Installer') {
      setIsInstaller(true)
    } else {
      setIsInstaller(false)
    }
    setFormValues((prevState) => {
      return {
        ...prevState,
        role: value,
      };
    });
  }

  const handleStateDropDown = (data) => {
    const { value } = data
    setFormValues((prevState) => {
      return {
        ...prevState,
        staffRegion: value,
      };
    });
  }

  const handleVendorDropDown = (data) => {
    const { value } = data
    setFormValues((prevState) => {
      return {
        ...prevState,
        vendor: value,
      };
    });
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitForm(true);
    setLoading(true);
    if (failedValidation() === false) {
      setLoading(false);
      return
    }
    setLoading(true);
    const { 
      fullName, email, phoneNumber, role,
      password, vendor, staffRegion
    } = formValues;

    if (isInstaller && !vendor) {
      toastr.error('Kindly Choose a Vendor');
      setLoading(false);
      return 
    }

    const response = await userService.registerUser({
      fullName, email, phoneNumber, role,
      password, vendor, staffRegion })
    const { status, message, error } = response
    console.log("Response ===============>>>>> ", response)
    if (status === 'success') {
      toastr.success('New staff have been Registered Succesfully');
      setLoading(false)
      return window.location.replace("/staffs");
    } else {
      const alertMessage = message ?? error
      toastr.error(alertMessage);
      setLoading(false)
    }
  };

  return (
    <>
    {
      loading ? <PageLoader /> :
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
                              <h5 className="mt-10 mb-5 text-brand-1">Register A New Staff </h5> 
                            </div>
                            <form className="login-register text-start mt-20" action="#">
                              <div className="form-group">
                                <label className="form-label" htmlFor="input-1">Full Name *</label>
                                <input 
                                  className="form-control" 
                                  type="text" 
                                  name="fullName" 
                                  placeholder="Full Name"
                                  onChange={handleChange}
                                  value={formValues.fullName}
                                />
                                {  formErrorMessage('fullName')?.length && <span className="form_errors"> { formErrorMessage('fullName') } </span>}
                              </div>

                              <div className="form-group">
                                <label className="form-label" htmlFor="input-1">Email</label>
                                <input 
                                  className="form-control" 
                                  type="text" 
                                  name="email" 
                                  placeholder="Email"
                                  onChange={handleChange}
                                  value={formValues.email}
                                />
                                { formErrorMessage('email')?.length && <span className="form_errors"> { formErrorMessage('email') } </span>}
                              </div>

                              <div className="form-group">
                                <label className="form-label" htmlFor="input-1">Phone Number *</label>
                                <input 
                                  className="form-control" 
                                  type="text" 
                                  name="phoneNumber" 
                                  placeholder="Phone Number"
                                  onChange={handleChange}
                                  value={formValues.phoneNumber}
                                />
                                { formErrorMessage('phoneNumber')?.length && <span className="form_errors"> { formErrorMessage('phoneNumber') } </span>}
                              </div>

                              <div className="form-group">
                                <label className="form-label" htmlFor="input-1">Staff Region</label>
                                <StateDropDown
                                  label={"State"}
                                  dataToComponent={handleStateDropDown}
                                />
                                { formErrorMessage('staffRegion')?.length && <span className="form_errors"> { formErrorMessage('staffRegion') } </span>}
                              </div>

                              <div className="form-group">
                                <label className="form-label" htmlFor="input-1">Type of Staff</label>
                                <StaffTypeDropDown
                                  label={"Staff Type"}
                                  dataToComponent={handleStaffTypeDropDown}
                                />
                                { formErrorMessage('role')?.length && <span className="form_errors"> { formErrorMessage('role') } </span>}
                              </div>

                              {
                                isInstaller &&
                                <>
                                  <VendorDropDown
                                    label={"Vendor"}
                                    dataToComponent={handleVendorDropDown}
                                  />
                                   { formErrorMessage('vendor')?.length && <span className="form_errors"> { formErrorMessage('vendor') } </span>}
                                  <br/>
                                </>
                              }
                              

                              <div className="form-group">
                                <label className="form-label" htmlFor="input-1">Password *</label>
                                <input 
                                  className="form-control" 
                                  type="password" 
                                  name="password" 
                                  placeholder="Set Password"
                                  onChange={handleChange}
                                  value={formValues.password}
                                />
                                { formErrorMessage('password')?.length && <span className="form_errors"> { formErrorMessage('password') } </span>}
                              </div>

                              <div className="form-group">
                                <label className="form-label" htmlFor="input-1">Repeat Password *</label>
                                <input 
                                  className="form-control" 
                                  type="password" 
                                  name="repeatPassword" 
                                  placeholder="Set Password"
                                  onChange={handleChange}
                                  value={formValues.repeatPassword}
                                />
                                {  formErrorMessage('repeatPassword')?.length && <span className="form_errors"> { formErrorMessage('repeatPassword') } </span>}
                              </div>
                              
                              <div className="form-group">
                                <SubmitButton onClick={ handleSubmit } title={'Submit'} className={'btn btn-brand-1 w-100'}/>
                              </div>
                              <div className="login_footer form-group d-flex justify-content-between">
                                
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
    }
    </>
  )
}