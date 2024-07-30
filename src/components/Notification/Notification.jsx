import { useEffect, useState } from "react"
import parse from 'html-react-parser';
import { crudService } from '../../services/crudService';

export const Notifications = () => {
  const [data, setdata] = useState([]);
  useEffect(() => {
    crudService.getNotifications()
    .then((res) => {
      const { data } = res;
      setdata(data)
    });
  }, [])

  const notificationStyles = {
    background: 'url(../images/notify.svg) no-repeat center',
    display: 'inline-block',
    verticalAlign: 'middle',
    height: '52px',
    width: '30px',
    position: 'relative',
  };
  const iconStyles = {
    content: '""',
    height: '8px',
    width: '8px',
    background: 'url(../images/icon-notify.svg) no-repeat center',
    position: 'absolute',
    top: '15px',
    right: '15px',
  };

  const checkNotStatus = () => {
    const cssCheck = data.find((not) => not.isRead === 'not-read')
    if (cssCheck) {
      return {...iconStyles}
    } 
  }

  return (
    <div className="dropdown d-inline-block">
      <a 
        style={notificationStyles} 
        href="/#"
        id="dropdownNotify" 
        type="button" 
        data-bs-toggle="dropdown" 
        aria-expanded="false" 
        data-bs-display="static">
      </a>
      <span style={checkNotStatus()}></span>
        <ul className="dropdown-menu dropdown-menu-light dropdown-menu-end" aria-labelledby="dropdownNotify">
          {
          data.map((not, key)=> {
            return (
              <li key={key}>
                <a href="/#" className="dropdown-item active">
                  { parse(not.message) }
                  </a>
            </li>
            )
          })
          }       
        </ul>
    </div>
  )
}