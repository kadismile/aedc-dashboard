import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { userService } from "../services/userService.js";
import { MiniSpinner } from "../components/elements/spinners.jsx";
import { PageLoader } from "../components/elements/spinners.jsx";
import { Search } from "../components/elements/Search.jsx";
import AWN from "awesome-notifications";
import toastr from 'toastr'
import { WithPermissions } from "../components/elements/WithPermissions.jsx";
import { SUSPEND_USER_PERMISSIONS } from "../utils/permissions.js"
import { Link } from "react-router-dom";
import { crudService } from "../services/crudService.js";

export const Customers = (props) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setdata] = useState([]);
  const [newData, setNewData] = useState(false)
  let notifier = new AWN();

  const fetchData = () => {
    setLoading(true)
    crudService.getCustomers().then((res) => {
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

  const deleteStaff = (user) => {
    let onOk = async () => {
      const data = {
        userId: user._id,
        isActive: user.isActive
      }
      const response = await userService.deleteUser(data);
      const {status, message} = response
      if (status === 'success')
      setNewData(!newData)
      toastr.success(message);
    };
    let onCancel = () => {
      return;
    };
    notifier.confirm("Are you sure you want to go ahead with this?", onOk, onCancel, {
      labels: {
        confirm: `Delete ${user.fullName} ?`,
      },
    });
  }

  const listItems = data.map((user, key) => {
    let number = key + 1;
    return (
      <tr key={key}>
        <td>{number++}</td>
        <td>{user.name}</td>
        <td>{user.phoneNumber}</td>
        <td>{user.meterNumber}</td>
        <td>{user.address?.fullAddress}</td>
        <td> <a href="#/" onClick={() => navigate(`/user/${user._id}`)} className="paint-red" title="edit" >
          <i class="fa fa-edit" aria-hidden="true"></i> 
          </a> 
        </td>
        <WithPermissions permitedPermissions={ SUSPEND_USER_PERMISSIONS }>
          <td> <a href="#/" onClick={() => deleteStaff(user)} className="paint-red" title="delete" >
            <i class="fa fa-trash" aria-hidden="true"></i> 
            </a> 
          </td>             
        </WithPermissions>
      </tr>
    );
  });

  const handleSearchText = () => {
    setLoading(true)
    fetchData()
  };

  const handleLoadingChange = (isLoading) => {
    setLoading(isLoading)
  };

  const handleDataChange = (data) => {
    if (data.clearSearch) {
      fetchData();
      return
    }
    setdata(data);
  };


  return (
    <>
    
    { 
      loading? <PageLoader /> :
      <div className="box-content">
        <div className="box-heading">
          <div className="box-title">
            <h3 className="mb-35">Customers Management</h3>
          </div>
          <div className="box-breadcrumb">
            <div className="breadcrumbs">
              <ul>
                <li>
                  {" "}
                  <a className="icon-home" href="index.html">
                    Customers 
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
                        model={'customers'}
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
                            Register User
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
                            <th scope="col">Full Name</th>
                            <th scope="col">Phone Number</th>
                            <th scope="col">Meter Num.</th>
                            <th scope="col">House Address</th>
                            <th scope="col"></th>
                            <th scope="col"></th>
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