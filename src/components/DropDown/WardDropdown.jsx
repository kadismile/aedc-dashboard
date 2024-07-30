import { useState } from "react";
import Select from 'react-select';


export default function WardDropDown ({ label, communityData, dataToComponent }) {
  const [selectedOption, setSelectedOption] = useState('other');

  const handleClick = async (data) => {
    const { value } = data
    setSelectedOption(value)
    dataToComponent({label, value})
  }


  const options = () => {
    return communityData.map((data) => {
      return {
        value: data.Community,
        label: data.Community
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
