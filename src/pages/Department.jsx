import { useEffect, useState } from "react";
import { crudService } from "../services/crudService";
import { MiniSpinner } from "../components/elements/spinners";
import AWN from "awesome-notifications";
import toastr from 'toastr'
import { EditDeptModal } from "../modals/EditDeptModal";
import { AddDeptModal } from "../modals/AddDeptModal";
import { PageLoader } from "../components/elements/spinners";

export const Department = (props) => {
  const [loading, setLoading] = useState(true);
  const [data, setdata] = useState([]);
  const [editData, setEditData] = useState({});
  const [newData, setNewData] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const notifier = new AWN();

  const fetchData = () => {
    crudService.getDepts().then((res) => {
      const { data } = res;
      setdata(data);
      setTimeout(() => setLoading(false), 500)
    });
  }

  useEffect(() => {
    fetchData()
  }, [newData]);

  
  const handleShowModal = (data) => {
    setEditData(data)
    setShowModal(true);
  };

  const handleAddShowModal = () => {
    setShowAddModal(true)
  };

  const handleCloseModal = (data) => {
    if (data?.addDept) {
      setShowAddModal(false);
      fetchData();
    }
    if (data?.editDept) {
      setShowModal(false);
      fetchData();
    }
    setNewData(!newData)
  };

  const deleteBundle = (data) => {
    let onOk = async () => {
      const response = await crudService.delDept(data);
      const {status, message} = response
      if (status === 'success')
      toastr.success(message);
      fetchData();
    };
    let onCancel = () => {
      return;
    };
    notifier.confirm("Are you sure?", onOk, onCancel, {
      labels: {
        confirm: `Delete ${data.acronym}`,
      },
    });
  }

  const listItems = data.map((dep, key) => {
    let number = key + 1;
    return (
      <tr key={key}>
        <td>{number++}</td>
        <td>{dep.name}</td>
        <td>{dep.acronym}</td>
        <td> <a href="#/" className="paint-red" title="delete" onClick={() => deleteBundle(dep)}> <i class="fa fa-trash" aria-hidden="true"></i> </a> </td>
        <td> <a href="#/" className="paint-red" title="edit" onClick={() => handleShowModal(dep)}> <i class="fa fa-edit" aria-hidden="true"></i> </a> </td>
      </tr>
    );
  });

  return (
    <>
      <EditDeptModal show={showModal} onHide={handleCloseModal} data={editData} />
      <AddDeptModal show={showAddModal} onHide={handleCloseModal} />
      
      {
        loading? <PageLoader /> :
        <div className="box-content">
          <div className="box-heading">
            <div className="box-title">
              <h3 className="mb-35">Department Management</h3>
            </div>
            <div className="box-breadcrumb">
              <div className="breadcrumbs">
                <ul>
                  <li>
                    {" "}
                    <a className="icon-home" href="index.html">
                    Departments 
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
                      <h5>Department</h5>
                      <a className="menudrop" id="dropdownMenu2" type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      data-bs-display="static"
                      />
                      <ul className="dropdown-menu dropdown-menu-light dropdown-menu-end" aria-labelledby="dropdownMenu2" >
                        <li>
                          <a className="dropdown-item active" href="#/" onClick={() => handleAddShowModal()}>
                            Add new
                          </a>
                        </li>
                      </ul>
                    </div>
                    
                      (
                      <div className="panel-body">
                        <table class="table table-striped">
                          <thead>
                            <tr>
                              <th scope="col">#</th>
                              <th scope="col">Name</th>
                              <th scope="col">Acronym</th>
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