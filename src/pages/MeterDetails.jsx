import { useEffect, useState } from "react";
import { store } from '../redux/store';
import { useParams } from 'react-router-dom';
import { PageLoader } from "../components/elements/spinners";
import { crudService } from "../services/crudService";
import moment from "moment";


export const MeterDetails = () => {
  const [loading, setLoading] = useState(true)
  const [meter, setMeter] = useState(true)

  const { meterNumber } = useParams();
  let user = store?.getState()?.user?.user
  if (user) {
    user = user.user
  }  

  useEffect(() => {
    fetchData();
  }, [])

  const fetchData = () => {
    if (meterNumber) {
      crudService.getOneMeter(meterNumber)
      .then((res) => {
        const { status, data: { results } } = res
        if (status === 'success') {
          setLoading(false)
          setMeter(results[0])
        }
      })
    } else {
      console.log('No match found');
    }
  }
  

  return (
    <>
    {
      loading ? <PageLoader/>: 

      <>
        <div className="box-content">
          <div className="box-heading">
            <div className="box-title">
              <h3 className="mb-35">Meter Details</h3>
            </div>
            <div className="box-breadcrumb">
              <div className="breadcrumbs">
                <ul>
                  <li>
                    {" "}
                    <a className="icon-home" href="index.html">
                      Meter
                    </a>
                  </li>
                  <li>
                    <span>{meterNumber}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <div className="section-box">
                <div className="container">
                 
                  
                  <div className="panel-white mb-30">
                    <div className="box-padding">
                      
                      <h5>Meter Details</h5>
                      <hr/>
                      
                                <p> Produced By: <b style={{fontWeight: 'bolder', color: '#5e81ff'}}>{meter?.vendor?.name}</b> </p>
                                <hr/>
                                <p> Meter type: <b style={{fontWeight: 'bolder', color: '#5e81ff'}}>{meter?.typeOfMeter}</b> </p>
                                <hr/>
                                <p> Customer Name: <b style={{fontWeight: 'bolder', color: '#5e81ff'}}>{meter?.customer?.name}</b> </p>
                                <hr/>
                                <p> Customer Address: <b style={{fontWeight: 'bolder', color: '#5e81ff'}}>{meter?.customer?.address?.fullAddress} {meter?.customer?.address?.state}</b> </p>
                                <hr/>
                                <p> Status: <span style={{fontWeight: 'bolder', color: '#5e81ff'}}>{(meter?.meterStatus)}</span> </p>
                                <hr/>
                                
                      <div className="row mt-30">

                        <div className="col-lg-9">
                          <div className="row">
                            
                            
                            
                            <div className="col-lg-12">
                              <div className="form-group mt-10">
                              <h5 class="icon-edu">Meter history</h5>
                              </div>
                            </div>
                          </div>
                          <div className="box-timeline mt-50">
                            { 
                              meter?.meterHistory.map((meter) => {
                                return <> 
                            <div className="item-timeline">
                                  <div className="timeline-year">
                                    {" "}
                                    <span>{moment(meter.createdAt).format('dddd, MMMM Do YYYY, h:mm A')}</span>
                                  </div>
                                  <div className="timeline-info">
                                    <h6 className="color-brand-1 mb-20">
                                      {meter.action} &nbsp; at  &nbsp;
                                      {meter.address.fullAddress} {meter.address.state} state
                                    </h6>
                                  </div>
                            </div>
                                </>
                              })
                            }
          
                          </div>


                          
                        </div>



                        <br/>
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                        <br/>


                        <div className="col-lg-9">
                          <div className="row">
                            <div className="col-lg-12">
                              <div className="form-group mt-80">
                                 <h5 class="icon-edu">Meter Attachments</h5>
                              </div>
                            </div>
                          </div>
                          <div className="box-timeline mt-50">
                            { 
                              meter?.attachments.map((attachment) => {
                                return <> 
                            <div className="item-timeline">
                                  <div className="timeline-year">
                                    
                                  </div>
                                  <div className="timeline-info">
                                    <img src={attachment?.secure_url} alt="" style={{ width: '50%' }}/>
                                  </div>
                            </div>
                                </>
                              })
                            }
          
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

    }
    </>
  )
}