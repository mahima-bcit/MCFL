import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function RootLayout() {
  return (
    <div className="min-h-screen bg-mint font-body">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}