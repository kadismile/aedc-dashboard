import { useEffect, useState } from "react"
import React from "react"
import { store } from '../redux/store';
import { crudService } from "../services/crudService"
import moment from "moment";
import { PageLoader } from "../components/elements/spinners";
import { SMSReportModal } from "../modals/SMSreportModal";
import { EditSMSReportModal } from "../modals/EditSMSReportModal";

export const SMSReports = () => {
  let user = store?.getState()?.user?.user
  if (user) {
    user = user.user
  }
  const [loading, setLoading] = useState(true)
  const [smsReports, setSMSReports] = useState([])
  const [showSMSModal, setShowSMSModal] = useState(false);
  const [modalData, setModalData] = useState(undefined)
  const [showEditSMSModal, setEditSMSModal] = useState(false);


  const fetchData = () => {
    setLoading(true)
    crudService.getSMSReports().then((res) => {
      const { data } = res;
      setSMSReports(data)
      setTimeout(() => setLoading(false), 500)
    })
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleOpen = (data) => {
    setShowSMSModal(true);
    setModalData(data)
  }

  const checkReportPermissions = () => {
    if (!user.permissions.length) return false
    user.permissions.find((u) => u.permissions === "can-manage-reports")
  }
  

  const listData = smsReports?.map((report, key) => {
    let number = key + 1
    return (
      <tr key={key}>
        <td>{number++}</td>
        <td>{"+" + report?.sender} </td>
        <td>
          <a href="#/" onClick={ () => handleOpen(report)}
              type="submit" 
          > {report?.message?.substring(0, 120) + '...'}
          </a>
        </td>
        <td>{moment(report.createdAt).format("MMM D, YYYY h:mma")}</td>
        <td>
          {
            !report.reportCreated && (
          <button
            style={{lineHeight: "4px", padding: "7px 15px"}} 
            onClick={() => handleOpenModal(report)}
            class="btn btn-success btn-brand"
          >
          <i class="fa-solid fa-edit"></i>
          </button>
            )
          }
          
        </td>
      </tr>
    )
  })

  const handleCloseModal = () => {
    setShowSMSModal(false);
    setEditSMSModal(false);
    fetchData();
  };

  const handleOpenModal = (report) => {
    setEditSMSModal(true)
    setModalData(report)
  };

  return (
    <>
      <SMSReportModal show={showSMSModal} onHide={handleCloseModal} data={modalData} />
      <EditSMSReportModal show={showEditSMSModal} onHide={handleCloseModal} data={modalData} user={ user } />
      {loading ? (
        <PageLoader />
      ) : (
        checkReportPermissions() === false ? <h2 className="mt-100 ml-200"> kindly Meet Admin For Permissions</h2> :
        <div className="box-content">
          <div className="box-heading">
            <div className="box-title">
              <h3 className="mb-35">SMS Reports</h3>
            </div>
            <div className="box-breadcrumb">
              <div className="breadcrumbs">
                <ul>
                  <li>
                    {" "}
                    <a className="icon-home" href="index.html">
                      SMS Reports
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
                            
                            </span>
                          </div>
                          <div className="col-xl-8 col-lg-7 text-lg-end mt-sm-15">
                          
                            
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="panel-body">
                      <table class="table table-striped">
                        <thead>
                          <tr>
                            <th scope="col">#</th>
                            <th scope="col">Sender</th>
                            <th scope="col">Message</th>
                            <th scope="col">Date</th>
                            <th scope="col"></th>
                          </tr>
                        </thead>
                        <tbody>{listData}</tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      
      )}
    </>
  )
}
