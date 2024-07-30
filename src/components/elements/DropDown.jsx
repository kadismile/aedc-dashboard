import { useEffect, useState } from "react";
import Select from 'react-select';

import { reportService } from '../../services/reportsService'


export default function DropDown ({ label, dataToComponent }) {
  const [selectedOption, setSelectedOption] = useState('other');
  const [reportTypes, setReportTypes] = useState([])

  const handleClick = async (data) => {
    const { value } = data
    setSelectedOption(value)
    dataToComponent({label, value})
  }

  useEffect(() => {
    (async () => {
      const res = await reportService.getReportTypes(label)
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
