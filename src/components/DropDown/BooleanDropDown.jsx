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
    { value: true, label: 'Yes' },
    { value: false, label: 'No' },
    { value: false, label: 'I dont know' },
  ];

  const customStyles = {
    control: base => ({
      ...base,
      height: 52,
      minHeight: 52,
    })
  };
  
  return (
    <Select
        isSearchable={ false }
        styles={customStyles}
        defaultValue={{ label, value: selectedOption }}
        onChange={ handleClick }
        options={ options }
        
    />
  );
};
