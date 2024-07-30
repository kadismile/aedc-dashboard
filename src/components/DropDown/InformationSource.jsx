import { useState } from "react";
import Select from 'react-select';


export default function InformationSource ({ label, dataToComponent }) {
  const [selectedOption, setSelectedOption] = useState('No');

  const handleClick = async (data) => {
    const { value } = data
    setSelectedOption(value)
    dataToComponent({label, value})
  }

  const options = [
    { value: 'Facebook', label: 'Facebook' },
    { value: 'Twitter', label: 'Twitter' },
    { value: 'Whatsapp', label: 'Whatsapp' },
    { value: 'Eye witness', label: 'Eye witness' },
    { value: 'Website Link', label: 'Website Link' },
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
