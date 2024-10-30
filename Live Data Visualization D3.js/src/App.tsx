import './App.css';
import Chart from './components/Chart';
import Options from './components/Options';
import Title from './components/Title';
import DatePickers from './components/DatePickers';
import { Provider } from 'react-redux';
import { store } from './redux/store';

function App() {
  return (
    <Provider store={store}>
      <Title />
      <DatePickers />
      <Options />
      <Chart />
    </Provider>
  );
}

export default App;
