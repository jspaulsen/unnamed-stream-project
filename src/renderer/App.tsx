import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import AuthLogin from './Auth';
import Main from './Main';
import './App.css';

import { Provider } from 'react-redux';
import { store } from './store';
import AddEvent from './AddEvent';
import TitleBar from './TitleBar';

export default function App() {
  return (
    <Provider store={store}>
      <AuthLogin>
      <TitleBar />
        <Router>
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/add-event" element={<AddEvent />} />
          </Routes>
        </Router>
      </AuthLogin>
    </Provider>
  );
}