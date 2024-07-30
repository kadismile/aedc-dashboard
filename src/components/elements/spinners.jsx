
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

export const MiniSpinner = () => {
  return (
    <div className="spinner-container">
        <FontAwesomeIcon icon={faSpinner} className="fa-spin spinner-icon" />
    </div>
  );
};

export const LoadMoreSpinner = () => {
  return (
    <div className="spinner-container" style={{height: '0vh'}}>
        <FontAwesomeIcon icon={faSpinner} className="fa-spin spinner-icon" style={{width: '25px'}} />
    </div>
  );
};

export const PageLoader = () => {
  return (
    <>
    <div className='spinner'>
      <img src='/images/loader.gif' alt='' width={'20%'}/>
    </div>
    </>
  )
}
