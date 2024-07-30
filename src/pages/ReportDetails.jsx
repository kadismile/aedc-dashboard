import { useEffect, useState } from "react";
import { store } from '../redux/store';
import { useParams } from 'react-router-dom';
import moment from 'moment'
import { MediaDisplay } from '../components/elements/MediaDisplay';
import { crudService } from "../services/crudService";
import { AssignmentModal } from "../modals/AssignmentModel";
import { VerifyReportModal } from "../modals/VerifyReportModal";
import { EditReportModal } from "../modals/EditReportModal";
import { ReviewModal } from "../modals/ReviewModal";
import { DraftModal } from "../modals/DraftModal";
import { PageLoader } from "../components/elements/spinners";


export const ReportDetails = () => {
  const { reportSlug } = useParams();
  let user = store?.getState()?.user?.user
  if (user) {
    user = user.user
  }
  const [showModal, setShowModal] = useState(false);
  const [showAssModal, setShowAssModal] = useState(false);
  const [showVerifyModal, setVerifyModal] = useState(false);
  const [assData, setAssData] = useState();
  const [report, setReport] = useState(undefined);
  const [reportHistory, setreportHistory] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setEditModal] = useState(false);
  const [showCommentModal, setCommentModal] = useState(false);
  const [showDraftModal, setDraftModal] = useState(false);
  const [draftReport, setDraftReport] = useState(false);


  useEffect(() => {
    fetchData();
  }, [])

  const fetchData = () => {
    if (reportSlug) {
      crudService.getOneReport(reportSlug)
      .then((res) => {
        const { status, data: { report, reportHistory, draftReport} } = res
        if (status === 'success') {
          setLoading(false)
          setReport(report)
          setreportHistory(reportHistory)
          setDraftReport(draftReport)
          updateNotification({ userId: user._id, reportSlug })
        }
      })
    } else {
      console.log('No match found');
    }
  }


  const updateNotification = async (data) => {
    await crudService.updateNotification(data)
  }

  const capitalize = (value) => {
    value = value?.toString().toUpperCase()
    return value ? value : 'None'
  }

  const formatDate = (value) => {
    return moment(value).format('DD MMMM YYYY')
  }

  const colorStatus = (status) => {
    if (status === 'processing') {
      return '#fe8d59'
    }
    if (status === 'pending') {
      return '#e41a28'
    }

    if (status === 'processed') {
      return '#5cc05c'
    }
  }

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = (data) => {
    if (data?.updated) {
      fetchData()
      setVerifyModal(true)
    }
    if (data?.closeVerifyModal) {
      fetchData()
      setVerifyModal(false)
    }
    if (data?.closeAssModal) {
      setShowAssModal(false);
      fetchData()
    }
    setShowModal(false);
    setEditModal(false);
    setCommentModal(false);
    setDraftModal(false);
  };


  const displayVerifyAssButton = () => {
    const actionableUser = report?.actionableUsers
    if (actionableUser?.currentUser?._id === user?._id &&
        actionableUser?.nextActionableDept === user?.department?._id
      ) {
      return true
    }
  }

  const displayEditButton = () => {
    if (user.responder) {
      return false
    }
    const actionableUser = report?.actionableUsers
    if (actionableUser?.currentUser?._id === user?._id
      ) {
      return true
    }
    return false
  }

  const displayWorkOnReport = () => {
    const actionableUser = report?.actionableUsers
    if (displayEditButton() === true || actionableUser?.currentUser) return false
    // this checks for users that are responders e.g police , military
    if (user?.responder) {
      if (user?.responder === report?.responder) {
        return true
      }
    } else {
      if (
        actionableUser?.currentDepartment === user?.department._id
      ) {
        return true
      }
    }
    return true
  }

  const displayActionButtons = () => {
    if (report.status === "Resolved") {
      return false;
    }
    const actionableUser = report?.actionableUsers;
    return actionableUser?.nextActionableDept === user.department._id ||
          actionableUser?.agencyId.includes(user.responder)
  }

  const handleVerifyModal = (data) => {
    setVerifyModal(true)
    setAssData(data)
  }

  const handleAssingmentModal = (data) => {
    setShowAssModal(true);
    setAssData(data)
  }

  const getByTitle = () => {
    if (user?.department?.acronym === 'CPS') {
      return 'Assign to Responders'
    }

    if (user?.department?.acronym === 'CAMS') {
      return 'Verify Report'
    }

    if (user?.responder) {
      return 'Respond To Report'
    }
  }

  const showActionName = () => {
    if (user?.department?.acronym === 'CPS') {
      return 'Assign Report'
    }
    if (user?.department?.acronym === 'Responder') {
      return 'Respond To Report'
    }
    return 'Verify Report'
  }
  

  return (
    <>
    {
      loading ? <PageLoader/>: 

      <div className="box-content">
        <ReviewModal show={showCommentModal} onHide={handleCloseModal} report={report} user={user}/>
        <EditReportModal show={showEditModal} onHide={handleCloseModal} data={report} user={ user } />
        {/* <DisplayFileModal show={showModal} onHide={handleCloseModal} data={url} /> */}
        <AssignmentModal show={showAssModal} onHide={handleCloseModal} data={assData} />
        <VerifyReportModal 
          show={showVerifyModal} 
          onHide={handleCloseModal} 
          data={assData} 
          depAcronym={user.department.acronym}
          title={getByTitle()}
        />
        <DraftModal show={showDraftModal} onHide={handleCloseModal} draftReport={draftReport}/>
        <div className="box-heading">
          <div className="box-title"> 
            <h3 className="mb-35">{report?.reportSlug}</h3>
          </div>
          <div className="box-breadcrumb"> 
              <ul> 
                <li> 
                  { displayActionButtons() &&
                      <>
                      { 
                        displayWorkOnReport() ?
                          <li>
                            <button
                              style={{lineHeight: "5px"}} 
                              class="btn btn-success btn-brand"
                              onClick={() => handleAssingmentModal(report._id)}>
                              Work on Report?
                            </button>
                          </li> : ""
                      }

                        { displayEditButton() ?
                          <li>
                            <div className="form-group mt-10">
                                <button 
                                  onClick={() => setEditModal(true)} 
                                  style={{lineHeight: '5px'}}
                                  className="btn btn-default btn-brand">Edit Report
                                </button>
                            </div>
                          </li> : ''
                        }
                      </>
                  }
                  </li>
              </ul>
          </div>
        </div>
        <div className="row"> 
          <div className="col-lg-12">
            <div className="section-box">
              <div className="container">               
                <div className="panel-white mb-30">
                  <div className="box-padding">
                  <div className="panel-head">
                    <h5>Details</h5>
                    <p> Submitted By: <b style={{fontWeight: 'bolder', color: '#5e81ff'}}>{capitalize(report?.reporterId)}</b> </p>
                    <p> Date: <b style={{fontWeight: 'bolder', color: '#5e81ff'}}>{moment(report?.createdAt).format('DD MMM, YYYY')}</b> </p>
                    <p> Longitude: <b style={{fontWeight: 'bolder', color: '#7C8BAA'}}>{report?.address?.longitude }</b> </p>
                    <p> Latitude: <b style={{fontWeight: 'bolder', color: '#7C8BAA'}}>{report?.address?.latitude }</b> </p>
                    <p> Status: <span style={{color: colorStatus(report?.status), fontSize: '12px'}}>{capitalize(report?.status)}</span> </p>
                    <p> Reviews: <a href="#/" onClick={() => setCommentModal(true)}> <span style={{color: 'green', fontSize: '12px', fontWeight: 'bolder'}}>View Comments</span>  </a></p>
                    <p> Draft: <a href="#/" onClick={() => setDraftModal(true)}> <span style={{color: 'purple', fontSize: '12px', fontWeight: 'bolder'}}>View Draft</span>  </a></p>
                    
                    {displayActionButtons() &&
                      displayVerifyAssButton() ?
                      <p> 
                        <button 
                          onClick={() => handleVerifyModal(report._id)}
                          style={{lineHeight: '5px'}}
                          className="btn btn-warning btn-brand">{showActionName()}
                        </button>
                      </p> : ""
                    }
                    
                  </div>
                    <div className="row mt-30">
                      <div className="col-lg-12">
                        <div className="row">
                          <div className="col-lg-3 col-md-6">
                            <div className="form-group mb-30"> 
                              <label className="font-sm color-text-mutted mb-10">Date of Incidence</label>
                              <input className="form-control" type="text" readOnly value={formatDate(report?.dateOfIncidence)} />
                            </div>
                          </div>
                          <div className="col-lg-3 col-md-6">
                            <div className="form-group mb-30"> 
                              <label className="font-sm color-text-mutted mb-10">Incident Type</label>
                              <input className="form-control" type="text" readOnly value={report?.reportTypeId.name}  />
                            </div>
                          </div>

                          <div className="col-lg-3 col-md-6">
                            <div className="form-group mb-30"> 
                              <label className="font-sm color-text-mutted mb-10">Response From Security Agency</label>
                              <input className="form-control" type="text" readOnly value={capitalize(report?.intervention)} />
                            </div>
                          </div>
                          <div className="col-lg-3 col-md-6">
                            <div className="form-group mb-30"> 
                              <label className="font-sm color-text-mutted mb-10">Srcurity Agency </label>
                              <input className="form-control" type="text" readOnly value={capitalize(report?.agencyId?.name)} />
                            </div>
                          </div>
                          </div>



                          <div className="row">
                          <div className="col-lg-3 col-md-6">
                          <div className="form-group mb-30"> 
                              <label className="font-sm color-text-mutted mb-10">Number killed </label>
                              <input className="form-control" type="text" readOnly value={capitalize(report?.numberKilled)} />
                            </div>
                          </div>
                          <div className="col-lg-3 col-md-6">
                            <div className="form-group mb-30"> 
                              <label className="font-sm color-text-mutted mb-10">Number Injured</label>
                              <input className="form-control" type="text" readOnly value={capitalize(report?.numberInjured)} />
                            </div>
                          </div>
                          <div className="col-lg-3 col-md-6">
                            <div className="form-group mb-30"> 
                              <label className="font-sm color-text-mutted mb-10">Number Displaced</label>
                              <input className="form-control" type="text" readOnly value={capitalize(report?.numberDisplaced)} />
                            </div>
                          </div>
                          <div className="col-lg-3 col-md-6">
                            <div className="form-group mb-30"> 
                              <label className="font-sm color-text-mutted mb-10">Has it Happened Before ?</label>
                              <input className="form-control" type="text" readOnly value={capitalize(report?.reoccurence)} />
                            </div>
                          </div>
                        </div> 


                        <div className="row">
                          <div className="col-lg-3 col-md-6">
                            <div className="form-group mb-30"> 
                              <label className="font-sm color-text-mutted mb-10">State</label>
                              <input className="form-control" type="text" readOnly value={capitalize(report?.address.state)} />                            </div>
                          </div>
                          <div className="col-lg-3 col-md-6">
                            <div className="form-group mb-30"> 
                              <label className="font-sm color-text-mutted mb-10">Local Govt</label>
                              <input className="form-control" type="text" readOnly value={capitalize(report?.address.localGovt)} />                            </div>
                          </div>
                          <div className="col-lg-3 col-md-6">
                            <div className="form-group mb-30"> 
                              <label className="font-sm color-text-mutted mb-10">User Typed Address</label>
                              <input className="form-control" type="text" readOnly value={capitalize(report?.address.userTypedAddress)} />                            </div>
                          </div>
                          <div className="col-lg-3 col-md-6">
                            <div className="form-group mb-30"> 
                              <label className="font-sm color-text-mutted mb-10">Address</label>
                              <input className="form-control" type="text" readOnly value={capitalize(report?.address.fullAddress)} />                            </div>
                          </div>
                          
                        </div> 

                          <div className="row">
                            <div className="col-lg-12"> 
                              <div className="form-group mb-30"> 
                                <label className="font-sm color-text-mutted mb-10">Description</label>
                                <textarea className="form-control"
                                readOnly
                                name="message" rows={10} 
                                value={ report?.description }
                                />
                              </div>
                              
                          </div>
                          <div className="row">
                            <label className="font-sm color-text-mutted mb-10">Report Files </label>
                            {
                              report.attachments.map((file) => {
                                return (
                                <div className="col-xl-3 col-lg-4 col-md-6">
                                  <div className="card-grid-2 hover-up">
                                    <div className="card-grid-2-image-left">
                                      <div className="card-profile pt-10">
                                        <a  onClick={() => handleShowModal(file)}> 
                                        <MediaDisplay mediaLink={file.url}/></a>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                )
                              })
                            }
                          </div>

                          <div className="col-lg-12"> 
                            <div className="form-group mt-10">
                              <h5>Report History</h5>
                            </div>
                          </div>
                        </div>
                        <div className="box-timeline mt-50">
                          { reportHistory.map((rHistory) => {
                              return (
                              <div className="item-timeline"> 
                                <div className="timeline-year"> <span>{moment(rHistory?.createdAt).format('DD MMM YYYY h:mma')}</span></div>
                                <div className="timeline-info"> 
                                  <p className="color-brand-1 mb-20" style={{fontSize: '15px'}}>{rHistory?.comment}</p>
                                  <hr/>
                                </div>
                              </div>
                              )
                          })}
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