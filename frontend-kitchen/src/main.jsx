import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import axios from 'axios'; // ๐‘ (เนเธซเธกเน)

import 'bootstrap/dist/css/bootstrap.min.css'; // ๐‘ (เนเธซเธกเน) Import Bootstrap CSS
import './index.css'; //

import App from './App.jsx'

// ----------------------------------------------------
// (เนเธซเธกเน) เธ•เธฑเนเธเธเนเธฒ Axios Interceptor (เธ•เธฑเธงเธ”เธฑเธเธเธฑเธ)
// เนเธซเนเธชเนเธ Token เนเธเธเธฑเธเธ—เธธเธ Request
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);
// ----------------------------------------------------

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)

