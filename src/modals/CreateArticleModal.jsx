import { useState, useEffect } from 'react';
import { store } from '../redux/store';
import { Modal } from 'react-bootstrap';
import { LoadingButton, SubmitButton } from "../components/elements/Buttons"
import '../styles/custom.css';
import { crudService } from '../services/crudService';
import Editor from '../components/elements/Editor';
import { formErrorMessage } from '../helpers/form-error-messages';
import { NotificationContainer, NotificationManager } from 'react-notifications';
export const CreateArticleModal = (props) => {
  let user = store?.getState()?.user?.user
  if (user) {
    user = user.user
  }
  const formFields = {
    title: '',
    description: {},
    fileUpload: '',
    fileName: ''
  };

  const [submitForm, setSubmitForm] = useState(false);

  const [formValues, setFormValues] = useState({
    ...formFields,
    errors: formFields,
  });
  const [htmlData, setHtmlData] = useState();

  const [loading, setLoading] = useState(false);

  const failedValidation = () => {
    const { title, description, fileName } = formValues
    if (title?.length < 3 || !description?.length || !fileName?.length) {
      return true
    }
    return undefined
  }

  const handleChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    setFormValues((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  const onFileChange = (e) => {
    setFormValues((prvState) => {
      return {
        ...prvState,
        fileUpload: e.target.files[0],
        fileName: e.target.files[0].name
      };
    });
  };

  useEffect(() => {
    setFormValues((prvState) => {
      return {
        ...prvState,
        description: JSON.stringify(htmlData) || '',
      };
    });
  }, [htmlData]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitForm(true)
    if (failedValidation()) {
      return;
    }
    setLoading(true);
    const { title, description, fileUpload } = formValues;

    const form = new FormData();
    form.append('title', title);
    form.append('description', description);
    form.append("fileUpload", fileUpload);
    form.append("user", user._id);

    const response = await crudService.createArticle(form)
    const { status } = response
    if (status === 'failed') {
      NotificationManager.error(`Cannot Create Article`, '', 3000);
      setTimeout(() => setLoading(false), 1000)
    } else {
      NotificationManager.error(`Article Creation was  Successful`, '', 3000);
      setTimeout(() => setLoading(false), 1000)
      setFormValues((preVal) => {
        return {
          ...preVal,
          description: '',
          title: '',
          fileName: '',
          fileUpload: ''
        }
      })
      props.onHide({addArticle: true})
    }
  };


  return (
    <Modal
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={props.show}
      onHide={() => props.onHide({addArticle: true})}
      size='lg'
    >
      <Modal.Header closeButton>
        
      </Modal.Header>
      <Modal.Body>
          <div className="text-center">
            <h4 className="mt-10 mb-5 text-brand-1">Add Article</h4>
          </div>
          <div className="container">
            <NotificationContainer />
            <div className="row">
              <div className="col-lg-12 mb-40">
                  <form className="contact-form-style mt-30" id="contact-form" action="#" method="post">
                  <div className="row wow animate__ animate__fadeInUp animated" data-wow-delay=".1s" style={{visibility: 'visible', animationDelay: '0.1s', animationName: 'fadeInUp'}}>
                    <div className="col-lg-6 col-md-6">
                      <div className="input-style mb-20">
                        <input 
                          className="font-sm color-text-paragraph-2"
                          name="title" placeholder="Enter title of article"
                          type="text" 
                          onChange={handleChange}
                        />
                        { formErrorMessage('title', formValues, submitForm)}
                      </div>
                    </div>
                    
                    
                    <div className="col-lg-6 col-md-6">
                      <div className="form-group mb-30">
                        <div className="box-upload">
                          <div className="add-file-upload">
                            <input 
                              className="fileupload" 
                              type="file" 
                              placeholder='upload file' 
                              name="file" 
                              onChange={onFileChange}
                              />
                            
                            <a className="btn btn-default"> Upload </a>
                            {formValues.fileName}
                          </div>
                          { formErrorMessage('fileName', formValues, submitForm)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-lg-12 col-md-12">
                      <div className="textarea-style mb-30">
                        { formErrorMessage('description', formValues, submitForm) }
                      <Editor
                        data={htmlData}
                        onChange={setHtmlData}
                        holder="editorjs-container"
                      />
                      </div>
                    </div>
                  </div>
                </form>
                <p className="form-messege" />
              </div>
              <div className="form-group">
                { !loading ? (
                  <SubmitButton
                    onClick={handleSubmit}
                    title={"Create  Article"}
                    className={"btn btn-brand-1 w-100"}
                  />
                ) : (
                  <LoadingButton />
                )}
            </div>
            
            </div>
          </div>
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  );
};
