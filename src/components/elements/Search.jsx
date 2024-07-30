import { useState } from "react";
import { DisabledButton, LoadingButton, SubmitButton, } from "../elements/Buttons";
import { crudService } from "../../services/crudService";

export const Search = ({ loading, setLoading, setData, searchTextHandler, type }) => {

  const [searchText, setSearchText] = useState('');

  const formFields = {
    searchText: "",
  };

  const [submitForm, setSubmitForm] = useState(false);
  const [formValues, setFormValues] = useState({
    ...formFields,
    errors: formFields,
  });

  const disableForm = () => {
    const newValues = { ...formValues };
    let isError = false;
    for (let val of Object.values(newValues)) {
      if (val === "") {
        isError = true;
      }
    }
    if (isError && submitForm) {
      return true;
    }
    if (!isError && !submitForm) {
      return true;
    }
    if (isError && !submitForm) {
      return true;
    }
    if (!isError && !submitForm) {
      return false;
    }
  };

  const validateForm = (name, errors, value) => {
    switch (name) {
      case "searchText":
        errors.searchText = "";
        if (value?.length < 5) {
          errors.searchText = "characters must be more than 5 characters long!";
          setSubmitForm(false);
        } else {
          setSubmitForm(true);
        }
        return errors.searchText;
      default:
        setSubmitForm(false);
        break;
    }
  };

  const reload = () => {
    searchTextHandler()
  }

  const handleChange = (event) => {
    event.preventDefault();
    let { name, value } = event.target;
    if ( (searchText.length - value.length) > 5) {
      setSearchText('')
      reload()
    }
    let errors = formValues.errors;
    validateForm(name, errors, value);
    setFormValues((prevState) => {
      return {
        ...prevState,
        errors,
        [name]: value,
      };
    });
    for (let val of Object.values(formValues.errors)) {
      if (val !== "") {
        setSubmitForm(false);
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const { searchText } = formValues;
    const body = {
      searchText,
      query: {
        limit: 50,
      },
      type,
    };
    const response = await crudService.searchResource(body);
    const { status, data } = response;
    if (status === 'success') {
      setData(data);
      setSearchText(searchText)
      setLoading(false);
    }
  };


  return (
    <div className="d-flex rounded flex-wrap gap-3">
    <div className="form-group mb-0">
      <input
        type="text"
        className="form-control range_flatpicker flatpickr-input"
        placeholder="type key word ....."
        style={{ width: "250px" }}
        onChange={ handleChange }
        value={formValues.searchText}
        name="searchText"
      />
    </div>
    { disableForm() ? (
        <DisabledButton title={'Search'} className={'btn btn-brand-1 w-10'} style={{'padding': '10px 25px'}}/>
      ) : !loading ? (
        <SubmitButton onClick={ handleSubmit } title={'Search'} className={'btn btn-brand-1 w-10'} style={{'padding': '10px 25px'}}/>
      ) : (
        <LoadingButton title={'searching ...'}/>
      ) 
    }
  </div>
  )
}