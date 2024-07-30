'use client'
import { useState } from "react";
import Select from 'react-select';


export const ReportFilterDropDown = ({ label, dataToComponent }) => {
  const [selectedOption, setSelectedOption] = useState('No');

  const handleClick = async (data) => {
    let { value = '' } = data || {}
    setSelectedOption(value)
    dataToComponent({label, value})
  }

  const options = [
    { value: { sort: 1 }, label: 'Most Recent' },
    { value: { userId: true }, label: 'Assigned' },
    { value: { userId: false }, label: 'Un Assigned' },
    { value: { verified: 'verified' }, label: 'Resolved' },
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
        isClearable={true}
    />
  );
};
