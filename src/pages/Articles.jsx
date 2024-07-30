import { useEffect, useState } from "react";
import { crudService } from "../services/crudService.js";
import { MiniSpinner } from "../components/elements/spinners.jsx";
import AWN from "awesome-notifications";
import toastr from 'toastr'
import { EditResponderModal } from "../modals/EditResponderModal.jsx";
import { PageLoader } from "../components/elements/spinners.jsx";
import { WithPermissions } from "../components/elements/WithPermissions.jsx";
import { AGENCY_PERMISSIONS } from "../utils/permissions.js"
import { CreateArticleModal } from "../modals/CreateArticleModal.jsx";
import moment from "moment";
import { EditArticleModal } from "../modals/EditArticleModal.jsx";
import { Search } from "../components/elements/Search.jsx";

export const Articles = (props) => {
  const [loading, setLoading] = useState(true);
  const [data, setdata] = useState([]);
  const [editData, setEditData] = useState({});
  const [newData, setNewData] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  let notifier = new AWN();

  const fetchData = () => {
    crudService.getArticles().then((res) => {
      const { data: { data } } = res;
      setdata(data);
      setTimeout(() => setLoading(false), 500)
    });
  }

  useEffect(() => {
    fetchData()
  }, []);

  
  const handleShowModal = (data) => {
    setEditData(data)
    setShowModal(true);
  };

  const handleAddShowModal = () => {
    setShowAddModal(true)
  };

  const handleCloseModal = (data) => {
    if (data?.addArticle) {
      setShowAddModal(false)
      fetchData()
    }

    if (data?.editArticle) {
      setShowModal(false);
      fetchData()
    }
  };

  const deleteBundle = (data) => {
    let onOk = async () => {
      const response = await crudService.delAgency(data);
      const {status, message} = response
      if (status === 'success')
      toastr.success(message);
      fetchData()
    };
    let onCancel = () => {
      return;
    };
    notifier.confirm("Are you sure?", onOk, onCancel, {
      labels: {
        confirm: `Delete ${data?.name}`,
      },
    });
  }

  const handleSearchText = () => {
    setLoading(true)
    fetchData()
  };

  const handleLoadingChange = (isLoading) => {
    setLoading(isLoading)
  };

  const handleDataChange = (data) => {
    setdata(data);
  };

  const listItems = data.map((article, key) => {
    let number = key + 1;
    return (
      <tr key={key}>
        <td>{number++}</td>
        <td>{article.title}</td>
        <td>{article.user.fullName}</td>
        <td>{moment(article.createdAt).format('ll')}</td>
        <WithPermissions permitedPermissions={AGENCY_PERMISSIONS}>
          <td> <a href="#/" className="paint-red" title="delete" onClick={() => deleteBundle(article)}> <i class="fa fa-trash" aria-hidden="true"></i> </a> </td>
          <td> <a href="#/" className="paint-red" title="edit" onClick={() => handleShowModal(article)}> <i class="fa fa-edit" aria-hidden="true"></i> </a> </td>
        </WithPermissions>
        </tr>
    );
  });

  return (
    <>
      <EditArticleModal show={showModal} onHide={handleCloseModal} data={editData} />
      <CreateArticleModal show={showAddModal} onHide={handleCloseModal} />
      
      { 
        loading? <PageLoader /> :<div className="box-content">
        <div className="box-heading">
          <div className="box-title">
            <h3 className="mb-35">Articles Management</h3>
          </div>
          <div className="box-breadcrumb">
            <div className="breadcrumbs">
              <ul>
                <li>
                  {" "}
                  <a className="icon-home" href="index.html">
                  Articles 
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
                  <Search
                    loading={loading}
                    setLoading={ handleLoadingChange}
                    setData={ handleDataChange }
                    searchTextHandler={ handleSearchText }
                    type={'articles'}
                  />
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
                  { loading ? <MiniSpinner /> : 
                    (
                    <div className="panel-body">
                      <table class="table table-striped">
                        <thead>
                          <tr>
                            <th scope="col">#</th>
                            <th scope="col">Title</th>
                            <th scope="col">Author</th>
                            <th scope="col">Date</th>
                            <WithPermissions permitedPermissions={AGENCY_PERMISSIONS}>
                              <th scope="col"></th>
                              <th scope="col"></th>
                            </WithPermissions>
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