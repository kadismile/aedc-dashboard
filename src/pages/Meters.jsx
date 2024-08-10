import { useEffect, useState } from "react";
import { MiniSpinner } from "../components/elements/spinners.jsx";
import { PageLoader } from "../components/elements/spinners.jsx";
import { Search } from "../components/elements/Search.jsx";
import { Link } from "react-router-dom";
import { crudService } from "../services/crudService.js";

export const Meters = (props) => {
  const [loading, setLoading] = useState(true);
  const [data, setdata] = useState([]);
  const [newData, setNewData] = useState(false)

  const fetchData = () => {
    crudService.getMeters().then((res) => {
      const {
        data: { results },
      } = res;
      setdata(results);
      setTimeout(() => setLoading(false), 500)
    });
  }

  useEffect(() => {
    fetchData()
  }, [newData]);


  const meterStatusColor = (meterStatus) => {
    if (meterStatus === 'activated') {
      return 'green'
    }

    if (meterStatus === 'installed') {
      return 'orange'
    }

    if (meterStatus === 'assigned') {
      return '#0615f4'
    }
  }

  const listItems = data.map((meter, key) => {
    let number = key + 1;
    return (
      <tr key={key}>
        <td>{number++}</td>
       <td>  <Link to={`/meter/${meter.meterNumber}`}>  {meter.meterNumber} </Link></td>
        <td> <Link to={`/meter/${meter.meterNumber}`}> {meter.vendor.name} </Link></td>
        <td> <Link to={`/meter/${meter.meterNumber}`}> { <span style={{color: meterStatusColor(meter.meterStatus )}}> {meter.meterStatus} </span>}</Link></td>
        <td> <Link to={`/meter/${meter.meterNumber}`}> {meter?.customer?.name} </Link> </td>
      </tr>
    );
  });

  const handleSearchText = () => {
    console.log('Searching --------------')
    setLoading(true)
    fetchData()
  };

  const handleLoadingChange = (isLoading) => {
    setLoading(isLoading)
  };

  const handleDataChange = (data) => {
    setdata(data);
  };


  return (
    <>
    
    { 
      loading? <PageLoader /> :
      <div className="box-content">
        <div className="box-heading">
          <div className="box-title">
            <h3 className="mb-35">Meter Management</h3>
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
          <div className="col-xxl-12 col-xl-7 col-lg-7">
            
            <div className="section-box">
              <div className="container">
                <div className="panel-white">
                  <div className="panel-head">
                    <div className="row"> 
                    <div className=" col-lg-4"></div>
                      <Search
                        loading={loading} 
                        setLoading={handleLoadingChange}
                        setData={ handleDataChange }
                        searchTextHandler={ handleSearchText }
                        model={'meters'}
                      />
                    </div>
                    
                    <a className="menudrop" id="dropdownMenu2" type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    data-bs-display="static"
                    />
                    <ul className="dropdown-menu dropdown-menu-light dropdown-menu-end" aria-labelledby="dropdownMenu2" >
                      <li>
                        {/* <a className="dropdown-item active" href="#" onClick={() => setInviteModal(true)}>
                          Invite User
                        </a> */}

                        <Link className="dropdown-item active" to="/user/register">
                            Register installer
                        </Link> 
                      </li>
                    </ul>
                  </div>
                  { loading ? <MiniSpinner /> : 
                    (
                    <div className="panel-body">
                      <table class="table table-striped">
                        <thead>
                          <tr>
                            <th scope="col">#</th>
                            <th scope="col">Meter Number</th>
                            <th scope="col">Vendor Name</th>
                            <th scope="col">Status</th>
                            <th scope="col">Customer</th>
                          </tr>
                        </thead>
                        <tbody>
                          {listItems}
                        </tbody>
                      </table>
                  </div>

                    )
                  }
                  
                </div>
              </div>
            </div>

            
          </div>
          
        </div>

        

      </div> 
    }
    </>
  );
}