import { store } from '../../redux/store';
import { useDispatch } from "react-redux";
import { resetStaff } from "../../redux/staff-slice";
import { useEffect,  useState } from 'react';
import { crudService } from '../../services/crudService';
import { ChangePasswordModal } from '../../modals/ChangePasswordModal';
import { Notifications } from '../Notification/Notification';

export const Header = () => {
  const [data, setdata] = useState([]);
  const [showModal, setShowModal] = useState(false);
  let staff = store?.getState()?.staff?.staff

  if (staff) {
    staff = staff.staff
  }
  
  const { fullName } = staff

  const dispatch = useDispatch();

  const logOut = () => {
    dispatch( resetStaff() );
    window.location.replace("/");
  }

  useEffect(() => {
    
    
  }, [])

  const handleShowModal = (data) => {
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };


  return (
    <>
    <ChangePasswordModal show={showModal} onHide={handleCloseModal} />
      <header className="header sticky-bar"> 
        <div className="container">
          <div className="main-header">
            <div className="header-left">
              <div className="header-logo">
                <a className="d-flex" href="/">
                  <img alt="jobBox" src="/images/aedc_logo.png" style={{width: '58%'}}/>
                 {/*  <h3> E W E R</h3> */}
                </a>
                </div>
                
            </div>
            
            <div className="header-menu d-none d-md-block">
            
            </div>
            <div className="header-right">
              <div className="block-signin">
                <div className="dropdown d-inline-block">
                  <ul className="dropdown-menu dropdown-menu-light dropdown-menu-end" aria-labelledby="dropdownNotify">
                    <li><a className="dropdown-item active" href="#">10 notifications</a></li>
                    <li><a className="dropdown-item" href="#">12 messages</a></li>
                    <li><a className="dropdown-item" href="#">20 replies</a></li>
                  </ul>
                </div>
                
                <div className="member-login">
                  <img src="/images/profile-photo.webp" alt="jobBox" />
                  <div className="info-member"> 
                    <strong className="color-brand-1">{fullName}</strong>
                    <i className="color-brand-1 text-center">
                      <i class="fa-solid fa-right-from-bracket"> </i>
                      <a className="text-center" href="/login" onClick={() => logOut()}>Logout</a>
                    </i>
                    <div className="dropdown"><a className="font-xs color-text-paragraph-2 icon-down" 
                        id="dropdownProfile" 
                        type="button" data-bs-toggle="dropdown" 
                        aria-expanded="false" 
                        data-bs-display="static"
                        style={{color: '#3b65f5'}}>{staff?.department?.acronym}</a>
                      <ul className="dropdown-menu dropdown-menu-light dropdown-menu-end" aria-labelledby="dropdownProfile">
                        <li><a className="dropdown-item" href="/#">Profiles</a></li>
                        <br/>
                        <li><a className="dropdown-item" href="/login" onClick={() => logOut()}>Logout</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}