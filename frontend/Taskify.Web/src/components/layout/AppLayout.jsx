import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-gray-50">

      <Sidebar />


      <main className="ml-60">
        <div className="p-5">
          <Outlet />
        </div>
      </main>

    </div>
  );
}