import { useState, useEffect, useMemo } from 'react';
import { Modal } from 'react-bootstrap';
import { LoadingButton, SubmitButton } from "../components/elements/Buttons"
import { crudService } from '../services/crudService';
import Editor from '../components/elements/Editor';
import { formErrorMessage } from '../helpers/form-error-messages';
import { NotificationContainer, NotificationManager } from 'react-notifications';
export const EditArticleModal = ({ data, onHide, show }) => {
  const { title, description, attachments } = data;
  const [formValues, setFormValues] = useState({
    title, description, fileName: attachments 
  });
  const [submitForm, setSubmitForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [htmlData, setHtmlData] = useState();

  useEffect(() => {
    if (title && description) {
      setFormValues((preVal) => {
        return {
          ...preVal,
          title: data.title,
          description: data.description,
          fileName: data?.attachments[0]?.format,
          originalFile: data.attachments
        }
      })
    }
    return () => {
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, description,]);


  const handleChange = (event) => {
      event.preventDefault();
      let { name, value } = event.target;
      setFormValues((prevState) => {
        return {
          ...prevState,
          [name]: value,
        };
      });
  };

  const hideModal = () => {
    onHide({editArticle: true})
  }

  const onFileChange = (e) => {
    setFormValues((prvState) => {
      return {
        ...prvState,
        fileUpload: e.target.files[0],
        fileName: e.target.files[0].name,
        originalFile: undefined
      };
    });
  };

  const failedValidation = () => {
    const { title, description, fileName } = formValues
    if (title?.length < 3 || !description?.length || !fileName?.length) {
      return true
    }
    return undefined
  }

  const modalClosed = () => {
    setHtmlData(undefined)
    onHide({editArticle: true})
    setFormValues( (preVal) => {
      return {
      ...preVal,
      description: '',
      title: undefined,
      
    }});
  }  

  const editorData = () => {
    if (data?.description) {
      return JSON.parse(data.description)
    }
  }

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
    const { title, description, fileUpload, originalFile } = formValues;
    const fileToUpload = originalFile ? undefined : fileUpload

    const form = new FormData();
    form.append('title', title);
    form.append('_id', data._id);
    form.append('description', description);
    form.append("fileUpload", fileToUpload);
    form.append("user", data.user._id);

    const response = await crudService.updateArticle(form)
    const { status } = response
    if (status === 'failed') {
      NotificationManager.error(`Cannot Update Article`, '', 3000);
      setTimeout(() => setLoading(false), 1000)
    } else {
      NotificationManager.error(`Article Update was  Successful`, '', 3000);
      setTimeout(() => setLoading(false), 1000)
      setFormValues((preVal) => {
        return {
          ...preVal,
          description: '',
          title: '',
          fileName: '',
          fileUpload: '',
          originalFile: ''
        }
      })
      hideModal()
    }
  };

  return (
    <Modal
    aria-labelledby="contained-modal-title-vcenter"
    centered
    show={show}
    onHide={modalClosed}
    size='lg'
  >
    <Modal.Header closeButton>
      
    </Modal.Header>
    <Modal.Body>
        <div className="text-center">
          <h4 className="mt-10 mb-5 text-brand-1">Edit Article</h4>
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
                        value={ formValues.title ? formValues.title : data.title}
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
                      <p> click the  + below to add body description</p>
                      { formErrorMessage('description', formValues, submitForm)}
                      <Editor
                        data={htmlData ? htmlData : editorData()}
                        onChange={setHtmlData}
                        holder= {'editorjs-container'}
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
                    title={"Update  Article"}
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
