import { useState, useEffect } from "react"
import { Link } from "react-router-dom";
import { Footer } from "../components/Footer/Footer"
import { PageLoader } from "../components/elements/spinners"
import ReactMapGL, { Marker, Popup, NavigationControl } from "react-map-gl"
import 'mapbox-gl/dist/mapbox-gl.css';
import { LineChart } from "../components/charts/LineChart.jsx";
import { crudService } from "../services/crudService.js";
import { FilterModal } from "../modals/FilterModal.jsx";

export const Home = (props) => {
  const [loading, setLoading] = useState(false)
  const [customerCount, setCustomerCount] = useState(0)
  const [customers, setCustomers] = useState(0)
  const [selectedMarker, setSelectedMarker] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);

  const [filterData, setFilterData] = useState({
    totalNumber: 0,
    totalAssigned: 0,
    totalInstalled: 0,
    totalCommissioned: 0,
  })


  useEffect(() => {
    fetchCustomerCount()
    fetchCustomers()
  }, []);

  const fetchCustomerCount = () => {
    crudService.getCustomersCount().then((res) => {
      const { data } = res;
      setCustomerCount(data)
    })
  }

  const fetchCustomers = () => {
    crudService.getCustomers().then((res) => {
      setCustomers(res.data.results)
    })
  }

  const handleCloseModal = () => {
    setShowFilterModal(false);
  };

  const handleFilterData = (data) => {
    // TODO: move this to the backend in the nearst future
    const total = data?.count || 0
    const installed = data?.results.filter((meter) => meter.meterStatus === 'installed')
    const commissioned = data?.results.filter((meter) => meter.meterStatus === 'commisioned')
    const assigned = data?.results.filter((meter) => meter.meterStatus === 'assigned')
    setFilterData((prevState) => {
      return {
        ...prevState,
        totalNumber: total,
        totalInstalled: installed.length,
        totalCommissioned: commissioned.length,
        totalAssigned: assigned.length
      }
    })
  };

  const handleModal = () => {
    setShowFilterModal(true);
  }

  return (
    <>
      <FilterModal show={showFilterModal} onHide={handleCloseModal} dataFromFilter={handleFilterData} status={false}/>
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
                    onClick={() => handleModal() }
                    className="btn btn-default"
                    type="submit"
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
                  <div className="col-xxl-3 col-xl-6 col-lg-6 col-md-4 col-sm-6">
                    <div className="card-style-1 hover-up">
                      <div className="card-image">
                        {" "}
                        <img src="/images/computer.svg" alt="jobBox" />
                      </div>
                      <div className="card-info">
                        <div className="card-title">
                          <h3>
                            {filterData.totalNumber}
                            <span className="font-sm status up">
                              <span></span>
                            </span>
                          </h3>
                        </div>
                        <p className="color-text-paragraph-2">Total Number of Meters</p>
                      </div>
                    </div>
                  </div>

                  <div className="col-xxl-3 col-xl-6 col-lg-6 col-md-4 col-sm-6">
                    <div className="card-style-1 hover-up">
                      <div className="card-image">
                        {" "}
                        <img src="/images/computer.svg" alt="jobBox" />
                      </div>
                      <div className="card-info">
                        <div className="card-title">
                          <h3>
                            {filterData.totalInstalled}
                            <span className="font-sm status up">
                              <span></span>
                            </span>
                          </h3>
                        </div>
                        <p className="color-text-paragraph-2">Total Number of Meters Installed</p>
                      </div>
                    </div>
                  </div>

                  <div className="col-xxl-3 col-xl-6 col-lg-6 col-md-4 col-sm-6">
                    <div className="card-style-1 hover-up">
                      <div className="card-image">
                        {" "}
                        <img src="/images/computer.svg" alt="jobBox" />
                      </div>
                      <div className="card-info">
                        <div className="card-title">
                          <h3>
                            {filterData.totalCommissioned}
                            <span className="font-sm status up">
                              <span></span>
                            </span>
                          </h3>
                        </div>
                        <p className="color-text-paragraph-2">Total Number of Meters Commissioned</p>
                      </div>
                    </div>
                  </div>

                  <div className="col-xxl-3 col-xl-6 col-lg-6 col-md-4 col-sm-6">
                    <div className="card-style-1 hover-up">
                      <div className="card-image">
                        {" "}
                        <img src="/images/computer.svg" alt="jobBox" />
                      </div>
                      <div className="card-info">
                        <div className="card-title">
                          <h3>
                            {filterData.totalAssigned}
                            <span className="font-sm status up">
                              <span></span>
                            </span>
                          </h3>
                        </div>
                        <p className="color-text-paragraph-2">Total Number of Meters Assigned</p>
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
                    {customers.length &&
                    customers.map((report, index) => (
                      <div key={index}>
                        <Marker
                          longitude={Number(report.address.longitude)}
                          latitude={Number(report.address.latitude)}
                          anchor={"bottom-left"}
                          offsetLeft={-25} // very important 
                          offsetTop={50} // very important 
                        >
                          <div className="marker">
                            <img onClick={() => { setSelectedMarker(report) }} src="images/map-icon2.png" style={{ width: '2%' }} alt='dot' />
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
                            <Link to={`/report/${selectedMarker.name}`}>
                              <h6>{selectedMarker.address.state}</h6>
                              <p> {selectedMarker.name}</p>
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
                      <LineChart customer={customerCount} />
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
