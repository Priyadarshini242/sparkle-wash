import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';


function Login() {
  const [count, setCount] = useState(0);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // You can add validation here if needed
    navigate("/dashboard");
  };
 return (
  
  <div className='flex'>
   
  <div className="flex flex-col justify-center items-center">
   {/* Left Side - Blue */}
     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 80" width="110" height="60" aria-labelledby="dropTitle" role="img">
      <title id="dropTitle">White Water Drop</title>
      <path d="M32 4  C42 18, 56 34, 56 50  C56 68, 45 78, 32 78  C19 78, 8 68, 8 50 C8 34, 22 18, 32 4 Z" fill="white"/>
      </svg>
     <header className="w-full max-w-xl">
        <h1 className="text-5xl md:text-6xl font-extrabold text-blue-600 heading-shadow" >
          Sparkle Wash
        </h1>
        <img 
        src="/public/WhatsApp Image 2025-08-28 at 11.08.20 AM.jpeg "
        alt="Car"
        className="w-10 h-30 rounded-2xl shadow-lg object-cover bg-gray-100 flex items-center -center"/>
        <p className="mt-2 text-gray-600">Prefessional Car Washing Serives</p>
        <h4 class name="text-5xl md:text-6xl font-extrabold text-blue-500 heading-shadow">"SparkelWash alwaysleaves my vehicles looking brand new .the staff is professional and trough!"</h4>
      </header>
    </div>
   

       {/* Right Side - White */}
    <div className="w-1/2 h-full flex flex-col justify-center items-center p-0 m-0">
       <div className="flex flex-col  justify-center item-center w-0/2 h-full bg-blue-100 p-0 m-0">
           <h2 className="mt-10 text-center text-2xl/9font-bold tracking-tight text-white">Admin Login</h2>
            <p> Enter your credentials to access the admin dashboard</p>
         </div>
             

    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
    <form onSubmit={handleLogin} className="space-y-6">
      <div>
        <label htmlFor="Admin" placeholder="Enter your admin Id" className="block text-sm/6 font-medium text-gray-100">Admin ID</label>
        <div className="mt-2">
          <input 
          id="email" 
          type="email" 
          name="email"
          autoComplete="email" 
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your email"></input>
        </div>
        </div>

       <div>
         <div className="flex items-center justify-between">
           <label htmlFor="password" placeholder="Enter your password" className="block text-sm/6 font-medium text-gray-100">Password</label>
           <div className="text-sm">
            <a href="#" className="font-semibold text-indigo-400 hover:text-indigo-300">Forgot password?</a>
          </div>
        </div>
        <div className="mt-2">
          <input 
          id="password" 
          type="password" 
          name="password" 
          autoComplete="current-password" 
          className="W-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-blue-500"
          placeholder="Enter your Password"></input>
        </div>
          </div>
          <div>
              <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">Login</button>
          </div>
            </form>
            <p className="mt-10 text-center text-sm/6 text-gray-400">
               <a href="#" className="font-semibold text-indigo-400 hover:text-indigo-300">Secure login with 256-bit encryption</a>
            </p>
           
             </div>
     </div>
</div>

 
 ); 
}
export default Login;



