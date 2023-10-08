import Search from "./common/searchBar";
import {
    createBrowserRouter,
    RouterProvider,
  } from "react-router-dom";
import ErrorPage from "./common/errorPage";
import './App.scss';
import GalleryView from "./components/Gallery/GalleryView";
import ListView from './components/ListView/ListView';
import DetailsView from './components/Detail/DetailsView';
import { Navigate } from 'react-router-dom';

const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <Search />
      ),
      errorElement: <ErrorPage />,
      children: [
        {
          path: "/", 
          element: <Navigate to="/list" replace /> 
        },
        {
          path: "/gallery",
          element: (
            <GalleryView />
          )
        },
        {
          path: '/list',
          element: (
            <ListView />
          )
        },
        {
          path: "/detail/:name",
          element: <DetailsView />,
        }
      ],
    }
  ]);

export default function App() {
    return (
        <RouterProvider router={router} />
    )
}