'use client'
import { useState } from "react";
import Select from 'react-select';
import { setSearchParams } from "../../redux/staff-slice";
import { store } from '../../redux/store';


export const StateDropDown =  ({ label, dataToComponent }) => {
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
        value: 'Abuja',
        label: 'Abuja'
      },
      {
        value: 'Nassarawa',
        label: 'Nassarawa'
      },
      {
        value: 'Kogi',
        label: 'Kogi'
      },
      {
        value: 'Niger',
        label: 'Niger'
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
