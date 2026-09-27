import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import axios from 'axios'; // 👈 (ใหม่)

import 'bootstrap/dist/css/bootstrap.min.css'; // 👈 (ใหม่) Import Bootstrap CSS
import './index.css'; //

import App from './App.jsx'

// ----------------------------------------------------
// (ใหม่) ตั้งค่า Axios Interceptor (ตัวดักจับ)
// ให้ส่ง Token ไปกับทุก Request
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

