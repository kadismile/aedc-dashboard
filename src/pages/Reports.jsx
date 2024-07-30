import { useEffect, useState } from "react"
import React from "react"
import { crudService } from "../services/crudService"
import moment from "moment";
import { store } from '../redux/store';
import { Link } from "react-router-dom";
import { PageLoader } from "../components/elements/spinners";
import { Search } from "../components/elements/Search";
import { FilterModal } from "../modals/FilterModal";
import toastr from 'toastr'
import AWN from "awesome-notifications";
import { reportService } from "../services/reportsService";
import { WithPermissions } from "../components/elements/WithPermissions";
import { DELETE_REPORTS_PERMISSIONS } from "../utils/permissions";

export const Reports = () => {
  let notifier = new AWN();
  let user = store?.getState()?.user?.user
  if (user) {
    user = user.user
  }

  const data = [
    { id: 1, name: 'Mojek', phoneNumber: '08034578936', address: 'Lagos'},
    { id: 2, name: 'Protek', phoneNumber: '08047876353',  address: 'Lagos'},
    { id: 3, name: 'Raise Synergy', phoneNumber: '08037875434',  address: 'Lagos'},
    { id: 4, name: 'Momas Technology', phoneNumber: '09036763524',  address: 'Lagos'},
    { id: 5, name: 'Vendr Manufacturing', phoneNumber: '08027876434',  address: 'Lagos'}
  ]
  const [loading, setLoading] = useState(true)
  const [vendors, setVendors] = useState(data)
  const [showModal, setShowModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);


  const deleteReport = (data) => {
    let onOk = async () => {
      const response = await reportService.delReport(data);
      const {status, message} = response
      if (status === 'success')
      toastr.success(message);
      
    };
    let onCancel = () => {
      return;
    };
    notifier.confirm("Are you sure?", onOk, onCancel, {
      labels: {
        confirm: `Delete ${data?.reportSlug}`,
      },
    });
  }

useEffect(() => {
  setTimeout(() => {
    setLoading(false)
  }, 2000)
  }, []) 

  const checkReportPermissions = () => {
    if (!user.permissions.length) return false
    user.permissions.find((u) => u.permissions === "can-manage-reports")
  }


  console.log('reports =============>>>>ooo ', vendors )

  const listItems = vendors?.map((vendor, key) => {
    console.log('Report ---------->>>>> AGAIN', vendor)
    let number = key + 1
    return (
      <tr key={key}>
        <td>{number++}</td>
        <td>
          <Link to={`/report/${vendor?.id}`}> {vendor?.id} </Link>{" "}
        </td>
        <td>
          <Link to={`/report/${vendor?.reportSlug}`}>
          <span>{vendor?.name}{" "}</span>
          </Link>{" "}
        </td>
        <td>{vendor?.address}</td>
        <WithPermissions permitedPermissions={DELETE_REPORTS_PERMISSIONS}>
          <td> <a href="#/" className="paint-red" title="delete" onClick={() => deleteReport(vendor)}> <i class="fa fa-trash" aria-hidden="true"></i> </a> </td>
        </WithPermissions>
      </tr>
    )
  })


  const handleCloseModal = () => {
    setShowModal(false);
    setShowFilterModal(false)
  };

  const handleSearchText = () => {
    setLoading(true)
   
  };

  const handleLoadingChange = (isLoading) => {
    setLoading(isLoading)
  };

  const handleDataChange = (data) => {
    setVendors(data);
  };

  const handleFilterData = (data) => {
    setLoading(true)
    if (data?.length) {
      setLoading(false)
      setVendors(data)
    } else {
      setLoading(false)
    }
  }

  return (
    <>
      {loading ? (
        <PageLoader />
      ) : (
        checkReportPermissions() === false ? <h2 className="mt-100 ml-200"> kindly Meet Admin For Permissions</h2> :
        <>
        <FilterModal show={showFilterModal} onHide={handleCloseModal} dataFromFilter={handleFilterData} />
        <div className="box-content">
          <div className="box-heading">
            <div className="box-title">
              <h3 className="mb-35">Vendor Management</h3>
            </div>
            <div className="box-breadcrumb">
              <div className="breadcrumbs">
                <ul>
                  <li>
                    {" "}
                    <a className="icon-home" href="index.html">
                      Reports
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
                      <div className="">
                        <div className="row">
                          <div className="col-xl-4 col-lg-5">
                            <span className="font-sm text-showing color-text-paragraph">
                            <Search
                              loading={loading} 
                              setLoading={ handleLoadingChange }
                              setData={ handleDataChange }
                              searchTextHandler={ handleSearchText }
                              type={'reports'}
                            />
                            </span>
                          </div>
                          <div className="col-xl-8 col-lg-7 text-lg-end mt-sm-15">
                          <button 
                            onClick={() => setShowFilterModal(true)}
                            className="btn btn-default" 
                            type="submit" 
                          >
                            <i class="fa-solid fa-bars"></i> FIlter 
                          </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="panel-body">
                      <table class="table table-striped">
                        <thead>
                          <tr>
                            <th scope="col">#</th>
                            <th scope="col">Report ID</th>
                            <th scope="col">Type</th>
                            <th scope="col">Address</th>
                            
                            <th scope="col"></th>
                          </tr>
                        </thead>
                        <tbody>{ vendors?.length ? listItems : ''}</tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </>
      )}
    </>
  )
}
