import {useState, useEffect} from 'react'
import { Modal } from 'react-bootstrap';
import { reportService } from '../services/reportsService';
import moment from 'moment'




export const DraftModal = (props) => {

  const closeModal = () => {
    props.onHide()
  }

  const capitalize = (value) => {
    value = value?.toString().toUpperCase()
    return value ? value : 'None'
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

  const formatDate = (value) => {
    return moment(value).format('DD MMMM YYYY')
  }

  const { draftReport } = props || {}

  return (
    <Modal
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={props.show}
      onHide={closeModal}
      size="lg"
    >
      <Modal.Header closeButton>
        
      </Modal.Header>
      <Modal.Body>
        <div className="text-center">
            <h5 className="mt-10 mb-5 text-brand-1">{`Draft Report`} </h5>
          </div>
          <div className="box-content">
        
        <div className="box-heading">
          <div className="box-title"> 
            <h3 className="mb-35">{draftReport?.reportSlug}</h3>
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
                    <p> Submitted By: <b style={{fontWeight: 'bolder', color: '#5e81ff'}}>{capitalize(draftReport?.reporterId)}</b> </p>
                    <p> Date: <b style={{fontWeight: 'bolder', color: '#5e81ff'}}>{moment(draftReport?.createdAt).format('DD MMM, YYYY')}</b> </p>
                    <p> Status: <span style={{color: colorStatus(draftReport?.status), fontSize: '12px'}}>{capitalize(draftReport?.status)}</span> </p>
                    
                  </div>
                    <div className="row mt-30">
                      <div className="col-lg-12">
                        <div className="row">
                          <div className="col-lg-3 col-md-6">
                            <div className="form-group mb-30"> 
                              <label className="font-sm color-text-mutted mb-10">Date of Incidence</label>
                              <input className="form-control" type="text" readOnly value={formatDate(draftReport?.dateOfIncidence)} />
                            </div>
                          </div>
                          <div className="col-lg-3 col-md-6">
                            <div className="form-group mb-30"> 
                              <label className="font-sm color-text-mutted mb-10">Incident Type</label>
                              <input className="form-control" type="text" readOnly value={draftReport?.reportTypeId?.name}  />
                            </div>
                          </div>

                          <div className="col-lg-3 col-md-6">
                            <div className="form-group mb-30"> 
                              <label className="font-sm color-text-mutted mb-10">Response From Security Agency</label>
                              <input className="form-control" type="text" readOnly value={capitalize(draftReport?.intervention)} />
                            </div>
                          </div>
                          <div className="col-lg-3 col-md-6">
                            <div className="form-group mb-30"> 
                              <label className="font-sm color-text-mutted mb-10">Srcurity Agency </label>
                              <input className="form-control" type="text" readOnly value={capitalize(draftReport?.agencyId?.name)} />
                            </div>
                          </div>
                          </div>



                          <div className="row">
                          <div className="col-lg-3 col-md-6">
                          <div className="form-group mb-30"> 
                              <label className="font-sm color-text-mutted mb-10">Number killed </label>
                              <input className="form-control" type="text" readOnly value={capitalize(draftReport?.numberKilled)} />
                            </div>
                          </div>
                          <div className="col-lg-3 col-md-6">
                            <div className="form-group mb-30"> 
                              <label className="font-sm color-text-mutted mb-10">Number Injured</label>
                              <input className="form-control" type="text" readOnly value={capitalize(draftReport?.numberInjured)} />
                            </div>
                          </div>
                          <div className="col-lg-3 col-md-6">
                            <div className="form-group mb-30"> 
                              <label className="font-sm color-text-mutted mb-10">Number Displaced</label>
                              <input className="form-control" type="text" readOnly value={capitalize(draftReport?.numberDisplaced)} />
                            </div>
                          </div>
                          <div className="col-lg-3 col-md-6">
                            <div className="form-group mb-30"> 
                              <label className="font-sm color-text-mutted mb-10">Has it Happened Before ?</label>
                              <input className="form-control" type="text" readOnly value={capitalize(draftReport?.reoccurence)} />
                            </div>
                          </div>
                        </div> 


                        <div className="row">
                          <div className="col-lg-3 col-md-6">
                            <div className="form-group mb-30"> 
                              <label className="font-sm color-text-mutted mb-10">State</label>
                              <input className="form-control" type="text" readOnly value={capitalize(draftReport?.address?.state)} />                            </div>
                          </div>
                          <div className="col-lg-3 col-md-6">
                            <div className="form-group mb-30"> 
                              <label className="font-sm color-text-mutted mb-10">Local Govt</label>
                              <input className="form-control" type="text" readOnly value={capitalize(draftReport?.address?.localGovt)} />                            </div>
                          </div>
                          <div className="col-lg-3 col-md-6">
                            <div className="form-group mb-30"> 
                              <label className="font-sm color-text-mutted mb-10">User Typed Address</label>
                              <input className="form-control" type="text" readOnly value={capitalize(draftReport?.address?.userTypedAddress)} />                            </div>
                          </div>
                          <div className="col-lg-3 col-md-6">
                            <div className="form-group mb-30"> 
                              <label className="font-sm color-text-mutted mb-10">Address</label>
                              <input className="form-control" type="text" readOnly value={capitalize(draftReport?.address?.fullAddress)} />                            </div>
                          </div>
                          
                        </div> 

                          <div className="row">
                            <div className="col-lg-12"> 
                              <div className="form-group mb-30"> 
                                <label className="font-sm color-text-mutted mb-10">Description</label>
                                <textarea className="form-control"
                                readOnly
                                name="message" rows={10} 
                                value={ draftReport?.description }
                                />
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
      
      </div>


      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  );
}