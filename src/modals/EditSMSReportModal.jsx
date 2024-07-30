import { useState, useEffect } from "react";
import { Modal } from 'react-bootstrap';
import { store } from '../redux/store.js';
import moment from 'moment'
import DropDown from "../components/DropDown/DropDown.jsx"
import { CalendarModal } from "../modals/CalendarModal.jsx";
import { LoadingButton } from "../components/elements/Buttons.jsx";
import { reportService } from "../services/reportsService.js";
import toastr from 'toastr'
import StateDropDown from "../components/DropDown/StateDropDown.jsx";
import LGADropDown from "../components/DropDown/LGADropDown.jsx";
import { TimeDropDown } from "../components/elements/TimePicker.jsx";
import { useNavigate } from 'react-router-dom';
import { PageLoader } from '../components/elements/spinners.jsx';
import { kadunaCommunity, PlateauCommunities } from "../utils/wards.js";
import WardDropDown from "../components/DropDown/WardDropdown.jsx";
import { prepareAddresss } from "../utils/address-helper.js";
export const EditSMSReportModal = (props) => {
  let user = store?.getState()?.user?.user
  if (user) {
    user = user.user
  }
  const { sender, message, _id } = props.data || {}
  const navigate = useNavigate();
  useEffect(() => {
    setTimeout(() => setLoading(false), 500)
  })

  const calendarData = (calData) => {
    const errors = formValues.errors;
    setFormValues((prevState) => {
      return {
        ...prevState,
        errors,
        date: moment(calData).format('LL'),
        rawDate: moment(calData, "ddd MMM DD YYYY HH:mm:ss [GMT]ZZ").toDate()
      };
    });
  }

  const [submitForm, setSubmitForm] = useState(false);
  const [submited, setSubmited] = useState(false);
  const [lga, setLga] = useState(['select a state']);
  const [formCol, setFormCol] = useState('col-lg-6 col-md-12')
  const [WardCol, setWardCol] = useState('col-lg-4 col-md-4')
  const [displayCommunity, setDisplayCommunity] = useState(false)
  const [communities, setCommunities] = useState([])
  const [displayMediaLink, setDisplayLink] = useState(false)
  const [formValues, setFormValues] = useState({
    timeOfIncidence: "",
    reoccurence: "",
    intervention: "",
    informationSource: '',
    mediaLinks: '',
    agency:"",
    resolved: "",
    description: '',
    date: '',
    rawDate: '',
    reportTypeId: '',
    fileUpload: '',
    state: '',
    localGovt: '',
    community: '',
    nums_women_children_affected: '',
    numberKilled: '',
    numberInjured: '',
    userTypedAddress: '',
    landMark: ''
  });

  const [loading, setLoading] = useState(true);
  const handleDataFromDropDown = (data) => {
    const { value } = data
    const errors = formValues.errors;
    setFormValues((prevState) => {
      return {
        ...prevState,
        errors,
        reportTypeId: value
      };
    });
  };

  const handleStateData = (data) => {
    const { localGovt, state, community } = formValues
    const { label, value } = data
    const errors = formValues.errors;
    if (value && Array.isArray(value.lgas)) {
      setLga(value.lgas)
    }
    
    setFormValues((prevState) => {
      return {
        ...prevState,
        errors,
        state: label === 'State' ? value : state,
        localGovt: label === 'LGA' ? value : localGovt,
        community: label === 'Community' ? value : community,
      };
    });
  };

  const handleChange = (event) => {
    event.preventDefault();
    let { name, value } = event.target;
    setFormValues((prvState) => {
      return {
        ...prvState,
        [name]: value,
      };
    });
  };

  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleClick = () => {
    handleShowModal()
  };

  useEffect(() => {
    if (formValues.intervention === 'Yes') {
      setFormCol('col-lg-4 col-md-12')
    } else {
      setFormCol('col-lg-6 col-md-12')
    }

    if (formValues.informationSource === 'Website Link') {
      setDisplayLink(true)
    } else {
      setDisplayLink(false)
    }
  }, [formValues.intervention, formValues.informationSource])

  const getCommuinities = (localGovt) => {
    const foundCommunities = [...kadunaCommunity, ...PlateauCommunities].filter((comm) => comm.lga == localGovt)
    setCommunities(foundCommunities)
  }

  useEffect(() => {
    if (formValues.state.state === 'Kaduna' || formValues.state.state === 'Plateau') {
      getCommuinities(formValues.localGovt)
      setDisplayCommunity(true);
      setWardCol('col-lg-2 col-md-12');
    } else {
      setDisplayCommunity(false);
      setWardCol('col-lg-3 col-md-12')
    }
  }, [formValues.state, formValues.localGovt])

  const handleTimeInput = (time) => {
    const errors = formValues.errors;
    setFormValues((prevState) => {
      return {
        ...prevState,
        errors,
        timeOfIncidence: moment(time, "ddd MMM DD YYYY HH:mm:ss [GMT]ZZ").toDate()
      };
    });
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmited(true)
    setSubmitForm(true)
    let {
      reportTypeId,
      description,
      rawDate,
      timeOfIncidence,
      informationSource,
      mediaLinks,
      intervention,
      agency,
      state,
      localGovt,
      community,
      nums_women_children_affected,
      numberKilled,
      numberInjured,
      landMark,
      reoccurence,
      resolved
    } = formValues;

    if (!landMark) {
      setSubmited(false);
      return 
    }

    if (!reportTypeId) {
      setSubmited(false);
      return 
    }

    if (!landMark) {
      setSubmited(false);
      return 
    }
    if (!localGovt || !state || !description) {
      setSubmited(false);
      return 
    }

    let address
    if (landMark?.length > 10) {
      try {
        const { longitude, latitude, countryCode, fullAddress, country } = await prepareAddresss(landMark)
        if (!longitude || !fullAddress || !country) {
          setSubmited(false)
          return toastr.error('Kindly Check your Address fields');
        }
          address = {
            state: state.state,
            localGovt,
            community,
            country,
            countryCode,
            fullAddress,
            latitude,
            longitude,
            userTypedAddress: landMark,
          }
      } catch (error) {
        setSubmited(false)
        console.log('Error ===========>>>>>>> ', error)
      }
    } else {
      setSubmited(false)
      return toastr.error('your address field is not descriptive enough');
    }
    
    setLoading(true);
    const reporterId = sender
    agency = agency || '6516099fa067bf1e14652276' //small hack fix it later 
    const form = new FormData();
    form.append("reoccurence", reoccurence);
    form.append("resolved", resolved);
    form.append("dateOfIncidence", rawDate);
    form.append("timeOfIncidence", timeOfIncidence);
    form.append("informationSource", informationSource);
    form.append("mediaLinks", mediaLinks);
    form.append("reporterId", reporterId);
    form.append("reportTypeId", reportTypeId); 
    form.append("description", description);
    form.append("intervention", intervention);
    form.append("agencyId", agency);
    form.append("nums_women_children_affected", nums_women_children_affected);
    form.append("numberKilled", numberKilled);
    form.append("numberInjured", numberInjured);
    form.append("smsReport", true);
    form.append("smsReportId", _id);
    form.append("userId", user._id);
    form.append("address", JSON.stringify(address));

    const response = await reportService.createReports(form)
    const { status} = response
    if (status === 'failed') {
      toastr.error('Failed to Submit Report');
      setTimeout(() => setLoading(false), 1000)
    } else {
      props.onHide()
      toastr.success('Thank You, We Have Recieved your Report');
      setTimeout(() => setLoading(false), 1000)
      navigate('/reports')
    }
  };

  return (
    <Modal
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={props.show}
      onHide={props.onHide}
      size="xl"
    >
      <Modal.Header closeButton>
        
      </Modal.Header>
      <Modal.Body style={{padding: '3rem'}}>
        <div className="text-center">
          <h2 className="mt-10 mb-5 text-brand-1">Create SMS Report</h2>
        </div>

        <CalendarModal show={showModal} onHide={handleCloseModal} data={calendarData}/>
    {
        loading ? <PageLoader /> : 
          <section className="section-box">
            <div className="container">
              <div className="row">
                <div className="col-lg-12 mb-40">
                  <form
                    className="contact-form-style mt-30"
                    id="contact-form"
                    action="#"
                    method="post"
                  >
                    <div
                      className="row wow animate__ animate__fadeInUp animated"
                      data-wow-delay=".1s"
                      style={{
                        visibility: "visible",
                        animationDelay: "0.1s",
                        animationName: "fadeInUp",
                      }}
                    >

                      <div className="col-lg-12 col-md-12">
                        <div className="textarea-style mb-30">
                        <label className="form-label" htmlFor="input-2">Describe the incident and number of casualty *</label>
                          <textarea
                            className="font-sm color-text-paragraph-2"
                            name="description"
                            placeholder="Kindly Describe The Incident To The best of Your Ability"
                            value={formValues.description ? formValues.description : message}
                            onChange={handleChange}
                            style={{minHeight: '130px'}}
                          />
                          {submitForm && formValues.description.length < 1 ? <span className="form_error"> { 'Description is Mandatory' }</span> : ""}
                        </div>
                      </div>

                
                      <div className="col-lg-4 col-md-4">
                        <div className="input-style mb-20">
                        <label className="form-label" htmlFor="input-2">Date of Incident *</label>
                          <input
                            className="font-sm color-text-paragraph-2"
                            name="date"
                            value={formValues.date}
                            placeholder="Date of incidence"
                            type="text"
                            onClick={handleClick}
                          />
                        </div>
                      </div>
  
                      <div className="col-lg-4 col-md-4">
                        <div className="input-style mb-20">
                        <label className="form-label" htmlFor="input-2">Time of Incident *</label> <br/>
                        <TimeDropDown timeChange={handleTimeInput} />
                        </div>
                      </div>
  
                      <div className="col-lg-4 col-md-3">
                        <div className="input-style mb-20">
                        <label className="form-label" htmlFor="input-2">Type of Incident *</label>
                          <DropDown label={'Incident Type'} dataToComponent={ handleDataFromDropDown } />
                          {submitForm && formValues.reportTypeId.length < 1 ? <span className="form_error"> { 'Type of Incident is Mandatory' }</span> : ""}
                        </div>
                      
                      </div>


                      { displayCommunity && <div className="col-lg-1"> </div> }
                        
                      <div className={WardCol}>
                        <div className="input-style mb-20">
                          <div className="input-style mb-20">
                          <label className="form-label" htmlFor="input-2">State*</label>
                            <StateDropDown label={'State'} dataToComponent={ handleStateData } />
                            {submitForm && formValues.state.length < 1 ? <span className="form_error"> { 'State is Mandatory' }</span> : ""}
                          </div>
                        </div>
                      </div>
  
                      <div className={WardCol}>
                        <div className="input-style mb-20">
                          <div className="input-style mb-20">
                          <label className="form-label" htmlFor="input-2">Local Government*</label>
                            <LGADropDown label={'LGA'} lgaData={lga} dataToComponent={ handleStateData } />
                            {submitForm && formValues.localGovt.length < 1 ? <span className="form_error"> { 'Local Government is Mandatory' }</span> : ""}
                          </div>
                        </div>
                      </div>

                      {
                        displayCommunity && 
                        <div className={WardCol}>
                          <div className="input-style mb-20">
                            <div className="input-style mb-20">
                            <label className="form-label" htmlFor="input-2">Community*</label>
                              <WardDropDown label={'Community'} communityData={communities} dataToComponent={ handleStateData } />
                              {submitForm && formValues.localGovt.length < 1 ? <span className="form_error"> { 'Local Government is Mandatory' }</span> : ""}
                            </div>
                          </div>
                        </div>
                      }
                      
                      <div className={WardCol}>
                        <div className="form-group">
                          <label className="form-label" htmlFor="input-2">Address*</label>
                          <input
                            className="font-sm color-text-paragraph-2"
                            name="landMark"
                            onChange={handleChange}
                            value={formValues.landMark}
                            placeholder="Address"
                            type="text"
                          />
                          {submitForm && formValues.landMark.length < 1 ? <span className="form_error"> { 'LandMark is Mandatory' }</span> : ""}
                        </div>
                      </div>


                      { displayCommunity && <div className="col-lg-1"> </div> }
                    
                    
                    </div>
                  </form>
                  <p className="form-messege" />
                </div>
                
              </div>
              <div class="container">
                    <div class="row">
                      <div class="col-lg-4"></div>
                      <div class="col-lg-4">{
                        !submited ?
                        <button 
                          onClick={ handleSubmit } 
                          style={{width: '100%'}}
                          type="button" 
                          class="btn btn-block btn-success">Create Report
                        </button>
                        : <LoadingButton />
                      }
                      </div>
                      </div>
                    <div class="col-lg-4"></div>
                  </div>
            </div>
          </section>

    }

      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  );
};
