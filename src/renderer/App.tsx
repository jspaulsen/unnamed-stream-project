import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import AuthLogin from './Auth';
import Login from './Login';
import Main from './Main';
import './App.css';

import { Provider } from 'react-redux';
import { store } from './store';

export default function App() {
  return (
    <Provider store={store}>
      <AuthLogin>
        <Router>
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </Router>
      </AuthLogin>
    </Provider>
  );
}

// TODO: Need a callback route for Twitch OAuth

{/* <Route path="/main" element={<PrivateRoute> <Main/> </PrivateRoute>}/>
<Route path="/about" element={<PrivateRoute> <About/> </PrivateRoute>}/>
<Route path="/login" element={<Login/>}/> */}