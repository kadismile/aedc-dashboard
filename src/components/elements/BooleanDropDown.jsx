'use client'
import { useState } from "react";
import Select from 'react-select';


export default function BooleanDropDown ({ label, dataToComponent }) {
  const [selectedOption, setSelectedOption] = useState('No');

  const handleClick = async (data) => {
    const { value } = data
    setSelectedOption(value)
    dataToComponent({label, value})
  }

  const options = [
    { value: 'Yes', label: 'Yes' },
    { value: 'No', label: 'No' },
  ];

  const customStyles = {
    input: (provided) => ({
      ...provided,
      width: 100,
      height: 20,
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
        defaultValue={{ label, value: selectedOption }}
        onChange={ handleClick }
        options={ options }
        
    />
  );
};
