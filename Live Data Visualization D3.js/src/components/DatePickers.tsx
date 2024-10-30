import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { Dayjs } from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { setDateRange } from '../redux/slices/dateSlice';
import { useEffect } from 'react';

const DatePichers = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { from, to } = useSelector((state: RootState) => state.dateR);

  const fromDate = from ? dayjs(from) : null;
  const toDate = to ? dayjs(to) : null;

  const handleFromDateChange = (newFromDate: Dayjs | null) => {
    if (toDate && newFromDate && toDate.isBefore(newFromDate)) {
      alert('Error: Wrong time range. Start time must be before end time.');
    } else {
      dispatch(
        setDateRange({
          from: newFromDate?.toISOString() || null,
          to: toDate?.toISOString() || null,
        })
      );
    }
  };

  const handleToDateChange = (newToDate: Dayjs | null) => {
    if (newToDate && fromDate && newToDate?.isBefore(fromDate)) {
      alert('Error: Wrong time range.');
    } else {
      dispatch(
        setDateRange({
          from: fromDate?.toISOString() || null,
          to: newToDate?.toISOString() || null,
        })
      );
    }
  };

  useEffect(() => {
    console.log(`Date range updated: From ${from}, To ${to}`);
  }, [from, to]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateCalendar', 'DateCalendar']}>
        <div className='flex flex-col w-[320px] md:flex-row lg:mx-[50%] md:w-[100%] '>
          <div className='w-[320px] mx-10 mb-5'>
            <DemoItem label='From'>
              <DatePicker
                value={fromDate}
                defaultValue={dayjs()}
                onChange={handleFromDateChange}
              />
            </DemoItem>
          </div>
          <div className='w-[320px] mx-20'>
            <DemoItem label='To'>
              <DatePicker
                value={toDate}
                defaultValue={dayjs()}
                onChange={handleToDateChange}
              />
            </DemoItem>
          </div>
        </div>
      </DemoContainer>
    </LocalizationProvider>
  );
};

export default DatePichers;
