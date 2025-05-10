import { createBrowserRouter, RouterProvider } from "react-router-dom"
import DashboardLayout from "./Layouts/DashboardLayout"
import Dashboard from "./Pages/Dashboard/Dashboard"
import Analytics from "./Pages/Analytics/Analytics"
import './Styles/main.scss';
import Orders from "./Pages/Orders/Orders";
import Recommendations from "./Pages/Recommendations/Recommendations";
import Home from "./Pages/Home/Home";
function App() {

const routing = createBrowserRouter([

    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        { path: '/', element: <Home /> },
        { path: '/analytics', element: <Analytics /> },
        { path: '/orders', element: <Orders /> },
        { path: '/Recommendations', element: <Recommendations /> },
        
      ],
    },
])
  return (
    <RouterProvider  router={routing}></RouterProvider>
  
  )
}

export default App
