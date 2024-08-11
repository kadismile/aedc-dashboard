'use client'
import { useState } from "react";
import Select from 'react-select';
import { store } from '../../redux/store';


export const StatusDropDown =  ({ label, dataToComponent }) => {
  let staff = store?.getState()?.staff?.staff
  let searchParams
  if (staff) {
    searchParams = staff.searchParams?.incidentType
  }
  const [selectedOption, setSelectedOption] = useState('other');

  const handleClick = async (data) => {
    const { value, label } = data || {}
    setSelectedOption(value)
    dataToComponent({ label, value})
  }

  const options = () => {
    return [
      {
        value: 'new_meter',
        label: 'new_meter'
      },
      {
        value: 'installed',
        label: 'installed'
      },
      {
        value: 'assigned',
        label: 'assigned'
      },
      {
        value: 'commisioned',
        label: 'commisioned'
      },
    ]
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
