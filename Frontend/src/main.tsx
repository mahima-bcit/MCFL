import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Index from "./pages/Index.tsx";
import NavBar from "./components/layout/Navbar.tsx";
import Footer from "./components/layout/Footer.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div className="min-h-screen bg-mint font-body">
      <NavBar />
      <RouterProvider router={router} />
      <Footer />
    </div>
  </StrictMode>,
);
