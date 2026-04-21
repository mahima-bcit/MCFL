import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import NavBar from "./components/layout/Navbar.tsx";
import Footer from "./components/layout/Footer.tsx";
import routes from "./routes.tsx";

const router = createBrowserRouter(routes);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div className="min-h-screen bg-mint font-body">
      <NavBar />
      <RouterProvider router={router} />
      <Footer />
    </div>
  </StrictMode>,
);
