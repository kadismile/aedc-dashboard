import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { userService } from '../services/userService'
import { PageLoader } from "../components/elements/spinners";
import AWN from "awesome-notifications";
import toastr from 'toastr'
import { SuspendUserButton } from "../components/elements/Buttons";
import { WithPermissions } from "../components/elements/WithPermissions";
import { SUSPEND_USER_PERMISSIONS } from "../utils/permissions.js"


export const UserProfile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null)
  const [newData, setNewData] = useState(false)
  const [loading, setLoading] = useState(true)
  const [checkboxes, setCheckboxes] = useState([]);
  const [checkedPermissions, setCheckedPermissions] = useState([]);
  let notifier = new AWN();

  useEffect(() => {
    userService.getOneUser(userId)
    .then((res) => {
      const {status, data } = res
      if (status === 'success') {
        setUser(data.user)
        setCheckboxes(data.permissions)
        setCheckedPermissions(data.user.permissions)
        setTimeout(()=> setLoading(false), 500)
      }
    })
  }, [newData])

  const suspendUser = (user) => {
    let onOk = async () => {
      const data = {
        userId: user._id,
        isActive: user.isActive
      }
      const response = await userService.suspendUser(data);
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
        confirm: `Suspend ${user.fullName} ?`,
      },
    });
  }

  const buttonTitle = () => {
    if (user.role === 'superAdmin') return
    return user.suspended === true ? 'Un-Suspend User' : 'Suspend User'
  }

  const suspendButtonClass = () => {
    if (user.role === 'superAdmin') return
    return user.suspended === false ? 'btn btn-danger btn-xm' : 'btn btn-success btn-xm'
  }

  const handleCheckboxChange = (permission) => {
    setCheckedPermissions((prevChecked) => {
      if (prevChecked.includes(permission)) {
        return prevChecked.filter((p) => p !== permission);
      } else {
        return [...prevChecked, permission];
      }
    });
  };

  const savePermissions = () => {
    let onOk = async () => {
      const data = {
        userId: user._id,
        permissions: checkedPermissions
      }
      const response = await userService.addPermissions(data);
      const {status, message} = response
      if (status === 'success')
      setNewData(!newData)
      toastr.success(message);
    };
    let onCancel = () => {
      return;
    };
    notifier.confirm("", onOk, onCancel, {
      labels: {
        confirm: `Add these permissions for ${user.fullName} ?`,
      },
    });
  }


  return (
    <>
    { loading ? <PageLoader /> :
      <div className="box-content">
        <div className="box-heading">
          <div className="box-title"> 
            
          </div>
          
        </div>
        <div className="row"> 
          <div class="col-md-1"></div>
          <div className="col-xxl-10 col-xl-8 col-lg-8">
            <div className="section-box">
              <div className="container"> 
                <div className="panel-white mb-30">
                  <div className="box-padding">
                    <h6 className="color-text-paragraph-2">{`${user.fullName}'s Profile`}</h6>
                    <div className="box-profile-image"> 
                      <div className="img-profile"> 
                      <img src="/images/profile-photo.webp" alt="jobBox" />
                      </div>
                      <div className="info-profile"> 
                        <WithPermissions permitedPermissions={ SUSPEND_USER_PERMISSIONS }>
                          <SuspendUserButton onClick={ () => suspendUser(user) } title={buttonTitle()} class={suspendButtonClass()}/>
                        </WithPermissions>
                      </div>
                    </div>

                    <>
                    </>
                    <div className="row"> 
                      <div className="col-lg-6 col-md-6">
                        <div className="form-group mb-30"> 
                          <label className="font-sm color-text-mutted mb-10">Full Name </label>
                          <input className="form-control" type="text" readOnly value={user.fullName} />
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <div className="form-group mb-30">
                          <label className="font-sm color-text-mutted mb-10">Email </label>
                          <input className="form-control" type="text" readOnly value={user.email} />
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <div className="form-group mb-30">
                          <label className="font-sm color-text-mutted mb-10">Contact number</label>
                          <input className="form-control" type="text" readOnly value={user.phoneNumber} />
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6">
                        <div className="form-group mb-30">
                          <label className="font-sm color-text-mutted mb-10">User Department</label>
                          <input className="form-control" type="text" readOnly value={user.department.name}  />
                        </div>
                      </div>
                      <br/>
                      <br/>
                      <br/>
                      <br/>
                      <br/>
                      
                      <WithPermissions permitedPermissions={ SUSPEND_USER_PERMISSIONS }>
                        <div className="none">
                          <h6 class="color-text-paragraph-2">User Permissions</h6>
                          <div class="row mt-5"> </div>
                          <div class="col-lg-12"> 
                            <div class="mb-20">
                              {
                                checkboxes.map((box, index) => {
                                  return (
                                    <>
                                    <span className="btn btn-tag tags-link" key={index}>
                                      <input
                                          type="checkbox"
                                          value={box.action}
                                          key={index}
                                          checked={checkedPermissions.includes(box.action)}
                                          onChange={() => handleCheckboxChange(box.action)}
                                          style={{width: '15px', height: '15px'}}
                                        />
                                        &nbsp; &nbsp;{box.action}
                                    </span>
                                    </>
                                    
                                  )
                                })
                              }
                              
                            </div>
                            
                          </div>
                            {/* {
                              checkboxes.map((box, index)=> {
                                return (
                                  <div className="col-lg-2 col-md-6" key={index}>
                                    <div className="form-group mb-30"> 
                                      <label className="font-sm color-text-mutted mb-10"></label>
                                      <div key={index}>
                                      <span className="btn btn-tag tags-link" key={index}>
                                        <label>
                                          <input
                                            type="checkbox"
                                            value={box.action}
                                            checked={checkedPermissions.includes(box.action)}
                                            onChange={() => handleCheckboxChange(box.action)}
                                            style={{width: '15px', height: '15px'}}
                                          />
                                          <span className="font-sm color-text-mutted mb-10"> &nbsp;{box.action} </span>
                                        </label>
                                        </span>
                                      </div>
                                  </div>
                            </div>
                                )
                              })
                            } */}
                          <div className="col-lg-12"> 
                            <div className="form-group mt-10">
                              <button className="btn btn-default btn-brand" onClick={savePermissions}>Save Permissions</button>
                            </div>
                          </div>
                        </div>
                      </WithPermissions>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-1"></div>
        </div>
      </div>
    
    }
    </>
  )
}