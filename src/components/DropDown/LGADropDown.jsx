import { useEffect, useState } from "react";
import Select from 'react-select';


export default function LGADropDown ({ label, lgaData, dataToComponent }) {
  const [selectedOption, setSelectedOption] = useState('other');
  const handleClick = async (data) => {
    const { value } = data
    setSelectedOption(value)
    dataToComponent({label, value})
  }


  const options = () => {
    return lgaData?.map((lga) => {
      return {
        value: lga,
        label: lga
      }
    })
  }

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
        options={ options() }
        className={'select-react'}
    />
  );
};
