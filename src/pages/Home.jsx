import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom";
import { Footer } from "../components/Footer/Footer"
import { PageLoader } from "../components/elements/spinners"
import { crudService } from "../services/crudService"
import ReactMapGL, { Marker, Popup, NavigationControl } from "react-map-gl"
import 'mapbox-gl/dist/mapbox-gl.css';
import { LineChart } from "../components/charts/LineChart.jsx";
import { VerticalBarChart } from "../components/charts/VerticalBarChat.jsx";
import { FilterModal } from "../modals/FilterModal.jsx";

export const Home = (props) => {
  const [loading, setLoading] = useState(false)
  const [reports, setReports] = useState([])
  const [selectedMarker, setSelectedMarker] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);


  const handleCloseModal = () => {
    setShowFilterModal(false)
  };

  const handleFilterData = (data) => {
    setLoading(true)
    if (data?.length) {
      setLoading(false)
      setReports(data)
    } else {
      setLoading(false)
    }
  }

  return (
    <>
      
      {loading ? (
        <PageLoader />
      ) : (
        <div className="box-content">
          <div className="panel-head">
            <div className="">
              <div className="row">
                <div className="col-xl-6 col-lg-5">
                  <span className="font-sm text-showing color-text-paragraph">
                  </span>
                </div>
                <div className="col-xl-6 col-lg-7 text-lg-end mt-sm-15">
                  <div className="display-flex2">
                  <button 
                    onClick={() => setShowFilterModal(true)}
                    className="btn btn-default" 
                    type="submit" 
                    style={props.style}
                  >
                    <i class="fa-solid fa-bars"></i> FIlter 
                  </button>
                  
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xxl-12 col-xl-7 col-lg-7">

              <div className="section-box">
                <div className="row">
                  <div className="col-xxl-2 col-xl-6 col-lg-6 col-md-4 col-sm-6">
                    <div className="card-style-1 hover-up">
                      <div className="card-image">
                        {" "}
                        <img src="/images/computer.svg" alt="jobBox" />
                      </div>
                      <div className="card-info">
                        <div className="card-title">
                          <h3>
                            430,500
                            <span className="font-sm status up">
                              <span></span>
                            </span>
                          </h3>
                        </div>
                        <p className="color-text-paragraph-2">Total Number of Meters</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-xxl-2 col-xl-6 col-lg-6 col-md-4 col-sm-6">
                    <div className="card-style-1 hover-up">
                      <div className="card-image">
                        {" "}
                        <img src="/images/bank.svg" alt="jobBox" />
                      </div>
                      <div className="card-info">
                        <div className="card-title">
                          <h3>
                            152,400
                            <span className="font-sm status up">
                              <span></span>
                            </span>
                          </h3>
                        </div>
                        <p className="color-text-paragraph-2">
                          Mojek
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-xxl-2 col-xl-6 col-lg-6 col-md-4 col-sm-6">
                    <div className="card-style-1 hover-up">
                      <div className="card-image"> <img src="/images/lamp.svg" alt="jobBox" /></div>
                      <div className="card-info"> 
                        <div className="card-title">
                          <h3>134,500<span className="font-sm status up"><span></span></span>
                          </h3>
                        </div>
                        <p className="color-text-paragraph-2">Protek</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-xxl-2 col-xl-6 col-lg-6 col-md-4 col-sm-6">
                    <div className="card-style-1 hover-up">
                      <div className="card-image"> <img src="/images/headphone.svg" alt="jobBox" /></div>
                      <div className="card-info"> 
                        <div className="card-title">
                          <h3>73,900<span className="font-sm status up"><span></span></span>
                          </h3>
                        </div>
                        <p className="color-text-paragraph-2">Raise Synergy</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-xxl-2 col-xl-6 col-lg-6 col-md-4 col-sm-6">
                    <div className="card-style-1 hover-up">
                      <div className="card-image"> <img src="/images/look.svg" alt="jobBox" /></div>
                      <div className="card-info"> 
                        <div className="card-title">
                          <h3>56,200<span className="font-sm status up"><span></span></span>
                          </h3>
                        </div>
                        <p className="color-text-paragraph-2">Momas Technologies</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-xxl-2 col-xl-6 col-lg-6 col-md-4 col-sm-6">
                    <div className="card-style-1 hover-up">
                      <div className="card-image"> <img src="/images/doc.svg" alt="jobBox" /></div>
                      <div className="card-info"> 
                        <div className="card-title">
                          <h3>13,500<span className="font-sm status up"><span></span></span>
                          </h3>
                        </div>
                        <p className="color-text-paragraph-2">Vendr Manufacturing</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xxl-6 col-xl-5 col-lg-5">
            <div className="section-box">
                <div className="container">
                  <div className="panel-white">
                    <div className="panel-head">
                      <h5>Meters Map Statistics</h5>
                      <a className="menudrop" id="dropdownMenu2" type="button" data-bs-toggle="dropdown" aria-expanded="false" data-bs-display="static" />
                      <ul className="dropdown-menu dropdown-menu-light dropdown-menu-end" aria-labelledby="dropdownMenu2">
                        <li><a className="dropdown-item active" href="#">Add new</a></li>
                        <li><a className="dropdown-item" href="#">Settings</a></li>
                        <li><a className="dropdown-item" href="#">Actions</a></li>
                      </ul>
                    </div>
                    <div className="panel-body">
                    <ReactMapGL
                      mapboxAccessToken={process.env.REACT_APP_MAP_BOX_KEY}
                      mapLib={import('mapbox-gl')}
                      initialViewState={{
                        longitude: 7.0820,
                        latitude: 8.6753,
                        zoom: 6.6
                      }}
                      style={{ width: '100%', height: '700px' }}
                      mapStyle="mapbox://styles/mapbox/light-v11"
                    >
                    {reports.map((report, index) => (
                      <div key={index}>
                        <Marker
                          longitude={Number(report.address.longitude)}
                          latitude={Number(report.address.latitude)}
                          anchor={"bottom-left"}
                          offsetLeft={-25} // very important 
                          offsetTop={50} // very important 
                        >
                          <div className="marker">
                            <img onClick={() => { setSelectedMarker(report) }} src="images/map-icon2.png" style={{ width: '8%' }} alt='dot' />
                          </div>
                        </Marker>
                        { selectedMarker && (
                          <Popup
                            latitude={Number(selectedMarker.address.latitude)}
                            longitude={Number(selectedMarker.address.longitude)}
                            closeOnClick={false}
                            onClose={() => {
                              setSelectedMarker(false);
                            }}
                          >
                            <div>
                            <Link to={`/report/${selectedMarker.reportSlug}`}>
                              <h6>{selectedMarker.address.state}</h6>
                              <p> {selectedMarker.reportTypeId.name}</p>
                            </Link>
                            </div>
                          </Popup>
                        )}
                      </div>
                      ))
                    }
                    <NavigationControl />
                  </ReactMapGL>
                    </div>
                  </div>
                </div>
              </div>
            </div>


            <div className="col-xxl-6 col-xl-5 col-lg-5">
              <div className="section-box">
                <div className="container"> 
                  <div className="panel-white">
                    <div className="panel-head"> 
                      <h5>Meter Charts</h5>
                    </div>
                    <div className="panel-body" style={{height: '725px'}}>
                      <LineChart />
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <Footer />
        </div>
      )}
    </>
  )
}
