'use client'
import { useEffect, useState } from "react";
import Select from 'react-select';
import { setSearchParams } from "../../redux/staff-slice";
import { store } from '../../redux/store';
import { crudService } from "../../services/crudService";


export const VendorDropDown =  ({ label, dataToComponent }) => {
  let staff = store?.getState()?.staff?.staff
  let searchParams
  if (staff) {
    searchParams = staff.searchParams?.incidentType
  }

  const [selectedOption, setSelectedOption] = useState('other');
  const [vendors, setVendor] = useState([])


  const handleClick = async (data) => {
    const { value, label } = data || {}
    setSelectedOption(value)
    dataToComponent({ label, value})
  }

  useEffect(() => {
    (async () => {
      const res = await crudService.getVendors()
      setVendor(res.data.results)
    })();
  }, []);

  const options = () => {
    return vendors.map((vendor) => {
      return {
        value: vendor._id,
        label: vendor.name
      }
    })
  }

  const customStyles = {
    input: (provided) => ({
      ...provided,
      width: 100,
      height: 15,
      display: 'flex',
      alignItems: 'center',
    }),
    singleValue: (provided) => ({
      ...provided,
      marginTop: 2,
    }),
  };
  
  return (
    <Select
        styles={customStyles}
        defaultValue={{ 
          label: searchParams ? searchParams : label,
          value: selectedOption 
      }}
        onChange={ handleClick }
        options={ options() }
        className={'select-react'}
        isClearable={true}
    />
    
  );
};
