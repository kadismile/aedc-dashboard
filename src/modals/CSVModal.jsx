'use client';
import { useState, useEffect } from 'react'
import { Modal } from 'react-bootstrap';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';
import toastr from "toastr";
import { crudService } from '../services/crudService';
import { LoadingButton, SubmitButton } from '../components/elements/Buttons';


export const CSVModal = (props) => { 
  const formFields = {
    file: "",
  };
  const [formValues, setFormValues] = useState({
    ...formFields,
    errors: formFields,
  });
  const [loading, setLoading] = useState(false);

  const sampleData = [
    { 
      meterNumber: '10652790409', barcode: '12200390789094', typeOfMeter: 'three phase meter', 
      customerName: 'kadismile', phoneNumber: '07045678893', customerEmail: 'giovanni22@gmail.com', 
      address: 'Area 2 Garki Abuja', state: 'Abuja' 
    },
  ];

  const handleDownload = (e) => {
    e.preventDefault()
    const csv = Papa.unparse(sampleData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'meter-sample.csv');
  };

  const downloadErrorCsv = (data) => {
    console.log("Data =========>>> ", data )
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'error-sample.csv');
  };

  const handleChange = (event) => {
    event.preventDefault();
    let { name, value } = event.target;
    let { files } = event.currentTarget;
    let errors = formValues.errors;
    setFormValues((prevState) => {
      return {
        ...prevState,
        errors,
        [name]: value && !files ? value : files ? files : "",
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { file } = formValues;
    setLoading(true)
    if (!file) {
      toastr.error('kindly upload a csv file')
      setLoading(false)
      return; 
    }
    setLoading(true);
    setFormValues((prevState) => {
      return {
        ...prevState,
        errors,
      };
    });
    let formData = new FormData();
    formData.append("fileUpload", file[0]);
    let csvResponse = await crudService.uploadProductCsv(formData);
    console.log("CSV response =========>>>>>> ", csvResponse)
    const { status, data } = csvResponse;
    if (status === "failed") {
      toastr.error("Error uploading some values in csv file");
      setLoading(false)
      await downloadErrorCsv(data);
    }
    if (status === "success") {
      setLoading(false)
      toastr.success("Meter uploaded successfully");
    }
  };

  const { errors } = formValues;

  return (
    <>
      <Modal
        aria-labelledby="contained-modal-title-vcenter"
        centered 
        show={props.show} onHide={props.onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Upload Meter CSV</Modal.Title>
          <button 
              onClick={handleDownload}
              className="btn btn-default btn-md" 
              style={{padding: '6px 15px'}}
          >
                <i class="fa-solid fa-cloud-upload"></i> Sample
              </button>
        </Modal.Header>
        <Modal.Body>
          
          <form className="login-register text-start mt-20" action="#">
            <div className="form-group">
              <label className="form-label" htmlFor="input-1">
                Upload Meter CSV
              </label>
                
                <input
                      type="file"
                      name="file"
                      onChange={handleChange}
                      className="form-control"
                      data-height="90"
                      data-allowed-file-extensions="csv"
                      data-max-file-size="500K"
                    />
                    {errors.file && errors.file.length > 0 && (
                      <span className="addGroup__error">{errors.file}</span>
                    )}
            </div>
            {
              !loading ? (
                <SubmitButton onClick={ handleSubmit } title={'Upload Csv'} className={'btn btn-secondary'}/>
              ) : (
                <SubmitButton title={'Uploading....'} className={'btn btn-secondary'}/>
              )
            }
            
          </form>
        
        </Modal.Body>
        <Modal.Footer>
        </Modal.Footer>
      </Modal>
    </>
    
  );
};
