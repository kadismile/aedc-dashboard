import { useEffect, useState } from "react";
import { crudService } from "../services/crudService";
import { MiniSpinner } from "../components/elements/spinners";
import { PageLoader } from "../components/elements/spinners";

export const Reporters = (props) => {
  const [loading, setLoading] = useState(true);
  const [data, setdata] = useState([]);

  const fetchData = () => {
    crudService.getReporter().then((res) => {
      const {
        data: { data },
      } = res;
      setdata(data);
      setTimeout(() => setLoading(false), 500)
    });
  }

   useEffect(() => {
    fetchData()
  }, []);

  const listItems = data.map((user, key) => {
    let number = key + 1;
    return (
      <tr key={key}>
        <td>{number++}</td>
        <td>{user.fullName}</td>
        <td>{user.phoneNumber}</td>
        <td>{user.email}</td>
        <td>{'300'}</td>
        
      </tr>
    );
  });

  return (
    <>
    { loading? <PageLoader /> :
      <div className="box-content">
        <div className="box-heading">
          <div className="box-title">
            <h3 className="mb-35">Reporters Management</h3>
          </div>
          <div className="box-breadcrumb">
            <div className="breadcrumbs">
              <ul>
                <li>
                  {" "}
                  <a className="icon-home" href="index.html">
                    Users 
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
                    <h5>Reporters</h5>
                    <a className="menudrop" id="dropdownMenu2" type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    data-bs-display="static"
                    />
                    <ul className="dropdown-menu dropdown-menu-light dropdown-menu-end" aria-labelledby="dropdownMenu2" >
                      <li>
                        <a className="dropdown-item active" href="#">
                          Add new
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#">
                          Settings
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#">
                          Actions
                        </a>
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
                            <th scope="col">Full Name</th>
                            <th scope="col">Phone Number</th>
                            <th scope="col">Email</th>
                            <th scope="col">Report Count</th>
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