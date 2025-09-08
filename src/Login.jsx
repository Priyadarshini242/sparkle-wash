import { useState } from 'react'
import './App.css'
import { Link } from "react-router-dom"
import { BrowserRouter, Routes, Route, } from "react-router-dom";
import carImage from './assets/cropped-car-wash.png';
// import earningsBarChart from './components/EarningsBarChart';


function Login() {
  const [count, setCount] = useState(0)

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Blue container */}
      <div className="flex flex-col justify-center items-center w-1/2 h-full bg-blue-600 p-0 m-0">
        <svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2 C9 6.2 6 9.6 6 13.2C6 16.9 8.9 20 12.5 20C16.1 20 19 16.9 19 13.2C19 9.6 15 6.2 12 2Z"/>
         </svg>
        <h1 className="text-xxl font-bold text-white text-center mb-3">SparkleWash</h1>
        <img className="w-full h-48 object-cover mb-4 p-0 m-0" src={carImage} alt="Car Wash" />
        <p className="text-3xl text-white p-4">Professional Car and Bike Washing Services</p>
        <div className="bg-indigo-600 rounded-lg shadow-lg p-4 m-4">
          <p className="card font-(family-name:<custom-property>)font-light text-white p-0">sparkleWash always leaves my vehicles looking brand new. The staff is professional and thorough!</p>
           <p className='text-white text-content-end'>-Satisfied Customer</p>
        </div>
      </div>

      {/* White container */}
      <div className="w-1/2 h-full bg-white flex flex-col justify-center items-center p-0 m-0">
        <div className="flex flex-col items-center w-full max-w-sm px-6 py-12">
          <h2 className="text-xl font-bold tracking-tight text-black mb-2">Admin Login</h2>
          <p className="text-grey font-normal mb-6">Enter your Credentials to access the admin dashboard</p>
          <form className="space-y-6 w-full">
            <div>
                <div class="flex items-center px-3 py-2 bg-white">
                {/* <!-- Email icon --> */}
                <svg xmlns="http://www.w3.org/2000/svg" 
                    fill="none" viewBox="0 0 24 24" 
                    stroke-width="1.5" stroke="currentColor" 
                    class="w-5 h-5 text-gray-500">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 7.5l-9 6-9-6" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75l8.88 5.55c.21.13.48.13.69 0l8.88-5.55" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5A2.25 2.25 0 0119.5 19.5H4.5a2.25 2.25 0 01-2.25-2.25V6.75" />
                </svg>
                <input type="email" placeholder="Enter your email"
                      class="ml-2 w-full outline-none border-none" />
              </div>
            </div>
                <div class="flex items-center px-3 py-2 mt-3 bg-white"> 
                  <div class="flex items-center px-3 py-2 mt-3 bg-white">
                 {/* <!-- Lock Icon --> */}
                    <svg xmlns="http://www.w3.org/2000/svg" 
                        fill="none" viewBox="0 0 24 24" 
                        stroke-width="1.5" stroke="currentColor" 
                        class="w-5 h-5 text-gray-500">
                      <path stroke-linecap="round" stroke-linejoin="round" 
                            d="M16.5 10.5V7.5a4.5 4.5 0 10-9 0v3m-1.5 0h12a1.5 1.5 0 011.5 1.5v7.5a1.5 1.5 0 01-1.5 1.5h-12a1.5 1.5 0 01-1.5-1.5v-7.5a1.5 1.5 0 011.5-1.5z" />
                    </svg>

                    {/* <!-- Password Input --> */}
                    <input type="password" 
                          placeholder="Enter your password" 
                          class="ml-2 w-full outline-none border-none text-gray-700 placeholder-gray-400" />
                    {/* <!-- Eye icon --> */}
                    <svg xmlns="http://www.w3.org/2000/svg" 
                        fill="none" viewBox="0 0 24 24" 
                        stroke-width="1.5" stroke="currentColor" 
                        class="w-5 h-5 text-gray-500 cursor-pointer">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12c2.25-4.5 6.75-7.5 9.75-7.5s7.5 3 9.75 7.5c-2.25 4.5-6.75 7.5-9.75 7.5s-7.5-3-9.75-7.5z" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                    </svg>
                  </div>
               </div>
               <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-sm">
                <div className="flex items-center space-x-2 mb-2">
                  <input
                    id="updates"
                    type="checkbox"
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="updates" className="text-gray-700 justify-between">Remember me</label>
                  <a href="#" className=" text-sm font-semibold text-indigo-400 hover:text-indigo-300">
                    Forgot passwor.....
                  </a>
                </div>
              </div>
              <div>
                <Link
                  to="/DashBoard"
                  className="px-4 py-2 bg-amber-400  text-black rounded-lg inline-block text-center w-full"
                   >
                  Login
                </Link>
              </div>
              <div class="flex items-center px-4 py-2 mt-3 bg-white">
                    {/* <!-- Lock Icon --> */}
                    <svg xmlns="http://www.w3.org/2000/svg" 
                        fill="none" viewBox="0 0 24 24" 
                        stroke-width="1.5" stroke="currentColor" 
                        class="w-5 h-5 text-gray-500">
                      <path stroke-linecap="round" stroke-linejoin="round" 
                            d="M16.5 10.5V7.5a4.5 4.5 0 10-9 0v3m-1.5 0h12a1.5 1.5 0 011.5 1.5v7.5a1.5 1.5 0 01-1.5 1.5h-12a1.5 1.5 0 01-1.5-1.5v-7.5a1.5 1.5 0 011.5-1.5z" />
                    </svg>
                 <p>secure login with 256-bit encryption</p>
              </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login;