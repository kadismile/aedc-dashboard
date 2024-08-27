import { useEffect, useState } from "react";
import { MiniSpinner } from "../components/elements/spinners.jsx";
import { PageLoader } from "../components/elements/spinners.jsx";
import { Search } from "../components/elements/Search.jsx";
import { Link } from "react-router-dom";
import { crudService } from "../services/crudService.js";
import { FilterModal } from "../modals/FilterModal.jsx";

export const Meters = (props) => {
  const [loading, setLoading] = useState(true);
  const [data, setdata] = useState([]);
  const [searched, setSearched] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [documentCount, setDocumentCount] = useState(0)

  const fetchData = () => {
    setLoading(true)
    crudService.getMeters().then((res) => {
      const {
        data: { results },
      } = res;
      setdata(results);
      setDocumentCount(res.data.filterdDocumentsCount)
      setTimeout(() => setLoading(false), 500);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCloseModal = () => {
    setShowModal(false);
    setShowFilterModal(false);
  };

  const meterStatusColor = (meterStatus) => {
    if (meterStatus === "new_meter") {
      return "green";
    }

    if (meterStatus === "installed") {
      return "orange";
    }

    if (meterStatus === "assigned") {
      return "#0615f4";
    }

    if (meterStatus === "commissioned") {
      return "#07a9ab";
    }
  };

  const listItems = () => {
    return data.map((meter, key) => {
    let number = key + 1;
    return (
      <tr key={key}>
        <td>{number++}</td>
        <td>
          {" "}
          <Link to={`/meter/${meter.meterNumber}`}> {meter.meterNumber} </Link>
        </td>
        <td>
          {" "}
          <Link to={`/meter/${meter.meterNumber}`}> {meter?.vendor?.name} </Link>
        </td>
        <td>
          {" "}
          <Link to={`/meter/${meter.meterNumber}`}>
            {" "}
            {
              <span style={{ color: meterStatusColor(meter.meterStatus) }}>
                {" "}
                {meter.meterStatus}{" "}
              </span>
            }
          </Link>
        </td>
        <td>
          {" "}
          <Link to={`/meter/${meter.meterNumber}`}>
            {" "}
            {meter?.customer?.name}{" "}
          </Link>{" "}
        </td>
        <td>
          {" "}
          <Link to={`/meter/${meter.meterNumber}`}>
            {" "}
            {meter?.address?.state}{" "}
          </Link>{" "}
        </td>
      </tr>
    );
  });
  }

  const handleSearchText = () => {
    setLoading(true);
    fetchData();
  };

  const handleLoadingChange = (isLoading) => {
    setLoading(isLoading);
  };

  const handleDataChange = (data) => {
    if (data.clearSearch) {
      fetchData();
      return
    }

    setSearched(true)
    setdata(data);
    setDocumentCount(data.length)
  };

  const handleFilterData = (data) => {
    if (searched === false) {
      setdata(data.results)
      setDocumentCount(data.filterdDocumentsCount)
    }
  };

  const handleModal = () => {
    setSearched(prevSearched => {
      return false;
    });
    setShowFilterModal(true);
  }

  return (
    <>
      {loading ? (
        <PageLoader />
      ) : (
        <>
        <FilterModal show={showFilterModal} onHide={handleCloseModal} dataFromFilter={handleFilterData} />
        <div className="box-content">
          <div className="box-heading">
            <div className="box-title">
              <h3 className="mb-10">Meter Management</h3>
              <div className="text-start">
                <a className="btn btn-tags-sm mb-10 mr-5" href="jobs-grid.html">
                  Count: {documentCount}
                </a>
              </div>
            </div>
            <div className="box-breadcrumb">
              <div className="breadcrumbs">
                <ul>
                  <li>
                    {" "}
                    <a className="icon-home" href="index.html">
                      Meters
                    </a>
                  </li>
                  <li>
                    <span>Dashboard</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="row">


          {/* <div className="col-xxl-12 col-xl-7 col-lg-7">
            <div className="section-box">
              <div className="row">
                <div className="col-xxl-3 col-xl-6 col-lg-6 col-md-4 col-sm-6">
                  <div className="card-style-1 hover-up">
                    <div className="card-image">
                      {" "}
                      <img src="assets/imgs/page/dashboard/computer.svg" alt="jobBox" />
                    </div>
                    <div className="card-info">
                      <div className="card-title">
                        <h3>
                          1568
                          <span className="font-sm status up">
                            25<span>%</span>
                          </span>
                        </h3>
                      </div>
                      <p className="color-text-paragraph-2">Interview Schedules</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
           
    
          </div> */}

            <div className="col-xxl-12 col-xl-7 col-lg-7">
              <div className="section-box">
                <div className="container">
                  <div className="panel-white">
                    <div className="panel-head">
                        <div className="row">
                          <div className="col-xl-6 col-lg-5">
                            <Search
                              loading={loading}
                              setLoading={handleLoadingChange}
                              setData={handleDataChange}
                              searchTextHandler={handleSearchText}
                              model={"meters"}
                            />
                           
                          </div>
                          <div className="col-xl-6 col-lg-7 text-lg-end mt-sm-15">
                            <div className="display-flex2">
                              <div className="dropdown dropdown-sort">
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
                    {loading ? (
                      <MiniSpinner />
                    ) : (
                      <div className="panel-body">
                        <table class="table table-striped">
                          <thead>
                            <tr>
                              <th scope="col">#</th>
                              <th scope="col">Meter Number</th>
                              <th scope="col">Vendor Name</th>
                              <th scope="col">Status</th>
                              <th scope="col">Customer</th>
                              <th scope="col">Current Location</th>
                            </tr>
                          </thead>
                          <tbody>{listItems()}</tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </>
      )}
    </>
  );
};
