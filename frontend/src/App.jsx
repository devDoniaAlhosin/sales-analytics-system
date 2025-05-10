import { createBrowserRouter, RouterProvider } from "react-router-dom"
import DashboardLayout from "./Layouts/DashboardLayout"
import Home from "./Pages/HomePage/Home"
import Analytics from "./Pages/AnalyticsPage/Analytics"
import './Styles/main.scss';
import Orders from "./Pages/OrdersPage/Orders";
import Recommendations from "./Pages/RecommendationPage/Recommendations";
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
