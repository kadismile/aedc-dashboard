import { useEffect, useState } from "react";
import Select from 'react-select';
import NaijaStates from 'naija-state-local-government';


export default function StateDropDown ({ label, dataToComponent }) {
  const [selectedOption, setSelectedOption] = useState('other');
  const [state, setState] = useState([])

  const handleClick = async (data) => {
    const { value } = data
    setSelectedOption(value)
    dataToComponent({label, value})
  }

  useEffect(() => {
    (async () => {
      setState(NaijaStates.all())
    })();
  }, []);

  const options = () => {
    return state.map((data) => {
      return {
        value: data,
        label: data.state
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
