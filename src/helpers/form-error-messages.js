import isEmail from 'validator/lib/isEmail';
import '../styles/custom.css'

export const formErrorMessage = (value, formValues, submitForm)  => {

    if (value === 'password') {
      if (submitForm && !formValues.password?.length  ) {
        return <span className="form_errors">Password field is mandatory</span>
      }
      if (submitForm && formValues.password?.length < 5 ) {
        return <span className="form_errors">Password field must be 6 characters or longer</span>
      }
    }

    if (value === 'repeatPassword') {
      if (submitForm && !formValues.repeatPassword.length  ) {
        return <span className="form_errors">Repeated password field is mandatory</span>
      }
      if (submitForm && formValues.repeatPassword.length < 5 ) {
        return <span className="form_errors">Repeated Password field must be 6 characters or longer</span>
      }

      if (submitForm && formValues.repeatPassword !== formValues.password ) {
        return <span className="form_errors">Repeated Password value is not same with password field </span>
      }
    }

    if (value === 'email') {
      if (submitForm && !formValues?.email?.length) {
        return (
          <span className="form_errors"> Email field is mandatory </span>
        )
      }

      if (submitForm && (!isEmail(formValues?.email) )) {
        return (
          <span className="form_errors"> Email is in correct </span>
        )
      }
    }

    if (value === 'address') {
      if (submitForm && !formValues.address?.fullAddress?.length  ) {
        return <span className="form_errors">Address field is mandatory</span>
      }
    }

    if (value === 'fullName') {
      if (submitForm && !formValues.fullName?.length  ) {
        return <span className="form_errors">Your Full name field is mandatory</span>
      }
    }

    if (value === 'phoneNumber') {
      if (submitForm && !formValues.phoneNumber?.length  ) {
        return <span className="form_errors">Phone number field is mandatory</span>
      }
    }

    if (value === 'description') {
      if (submitForm && !formValues.description?.length  ) {
        return <span className="form_errors"> description field is mandatory</span>
      }
    }

    if (value === 'title') {
      if (submitForm && !formValues.title?.length  ) {
        return <span className="form_errors"> title field is mandatory</span>
      }
    }

    if (value === 'comments') {
      if (submitForm && (!formValues.comments?.length || formValues.comments?.length < 10) ) {
        return <span className="form_errors"> Pls add a comment and should be meaningful</span>
      }
    }

    if (value === 'verMethod') {
      if (submitForm && !formValues.verMethod  ) {
        return <span className="form_errors"> Pls add a verification method</span>
      }
    }

    if (value === 'reportStatus') {
      if (submitForm && !formValues.reportStatus  ) {
        return <span className="form_errors"> Pls add a report status</span>
      }
    }

    if (value === 'camsVeriMethod') {
      if (submitForm && !formValues.camsVeriMethod ) {
        return <span className="form_errors"> Pls add a verification method</span>
      }
    }

    if (value === 'responder') {
      if (submitForm && !formValues.responder  ) {
        return <span className="form_errors"> Pls add a responder</span>
      }
    }

    if (value === 'camsVeriOptions') {
      if (submitForm && !formValues.camsVeriOptions  ) {
        return <span className="form_errors"> Pls add a verification option</span>
      }
    }
    //camsVeriOptions

    if (value === 'fileName') {
      if (submitForm && !formValues.fileName?.length  ) {
        return <span className="form_errors"> pls  add a file of image/video</span>
      }
    }
    return '';
}