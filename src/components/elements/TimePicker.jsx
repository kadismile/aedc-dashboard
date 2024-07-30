import TimePicker from 'rc-time-picker';
import moment from 'moment';
import 'rc-time-picker/assets/index.css';

export const TimeDropDown = ({timeChange}) => {
  const format = 'h:mm a';
  const now = moment()
  const onChange = (value) => {
    timeChange(value)
  }

  return (
    <TimePicker 
      showSecond={false}
      defaultValue={now}
      style={{ width: 300 }}
      className="font-sm color-text-paragraph-2"
      onChange={onChange}
      format={format}
      use12Hours
      inputReadOnly
    />
  )
}