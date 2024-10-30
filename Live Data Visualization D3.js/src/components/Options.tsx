import { useForm, SubmitHandler } from 'react-hook-form';
import optionsData from '../options.json';
import { AppDispatch } from '../redux/store';
import { useDispatch } from 'react-redux';
import { setOption } from '../redux/slices/optionsSlice';

interface FormInput {
  chartId: string;
  chartTitle: string;
}

interface Option {
  option: string;
  chartId: string;
}

const Options = () => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInput>();

  const onSubmit: SubmitHandler<FormInput> = (data) => {
    // Find the selected option in optionsData by chartId
    const selectedOption = optionsData.options.find(
      (option) => option.chartId === data.chartId
    );

    if (selectedOption) {
      // Dispatch the selected chartId and chartTitle from the form
      dispatch(
        setOption({
          chartId: data.chartId,
          chartTitle: selectedOption.chartTitle,
        })
      );
      console.log('chartId:', data.chartId);
      console.log('chartTitle:', selectedOption.chartTitle); // Corrected log
    }
  };

  const options: Option[] = optionsData.options;

  return (
    <div className='m-3 p-3'>
      <form onSubmit={handleSubmit(onSubmit)}>
        {options.map((opt, index) => (
          <div key={index} className='p-5'>
            <input
              type='radio'
              value={opt.chartId}
              {...register('chartId', { required: true })}
            />
            <label className='pl-5'>{opt.option}</label>
          </div>
        ))}
        {errors.chartId && <span>Please choose one of the charts!</span>}
        <div>
          <input
            className='border py-2 px-5 ml-[47%] rounded-lg bg-sky-500 font-bold'
            type='submit'
          />
        </div>
      </form>
    </div>
  );
};

export default Options;
