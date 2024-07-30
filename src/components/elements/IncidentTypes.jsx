'use client'
import { useEffect, useState } from "react";
import Select from 'react-select';
import { reportService } from '../../services/reportsService'
import { useDispatch } from "react-redux";
import { setSearchParams } from "../../redux/staff-slice";
import { store } from '../../redux/store';


export const IncidentType =  ({ label, dataToComponent }) => {
  let staff = store?.getState()?.staff?.staff
  let searchParams
  if (staff) {
    searchParams = staff.searchParams?.incidentType
  }
  const dispatch = useDispatch();

  const [selectedOption, setSelectedOption] = useState('other');
  const [reportTypes, setReportTypes] = useState([])


  const handleClick = async (data) => {
    const { value, label } = data || {}
    setSelectedOption(value)
    dispatch(setSearchParams({ incidentType: label }));
    dataToComponent({ label, value})
  }

  useEffect(() => {
    (async () => {
      const res = await reportService.getReportTypes()
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
