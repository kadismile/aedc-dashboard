'use client'
import { useEffect, useState } from "react";
import Select from 'react-select';
import { crudService } from "../../services/crudService";


export const MultiRespondersDropDown = ({ dataToComponent, label }) => {
  const [selectedOption, setSelectedOption] = useState('other');
  const [reportTypes, setReportTypes] = useState([])

  const handleClick = async (data) => {
    const value = data.map((d) => d.value)
    setSelectedOption(value)
    dataToComponent({label, value})
  }

  useEffect(() => {
    (async () => {
      const res = await crudService.getAgency()
      setReportTypes(res.data)
    })();
  }, []);

  const options = () => {
    return reportTypes.map((report) => {
      return {
        value: report._id,
        label: report.name
      }
    })
  }

  const customStyles = {
    input: (provided) => ({
      ...provided,
      width: 100,
      height: 38,
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
        isMulti={true}
        onChange={ handleClick }
        options={ options() }
        className={'select-react'}
    />
  );
};
