import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const AdminLayout = () => {
  const { logout } = useAuth();

  return (
    <div className="flex min-h-screen">
      <nav className="w-60 bg-gray-100 p-4">
        <h2 className="font-bold text-xl mb-4">Admin Panel</h2>
        <ul className="space-y-2">
          <li>
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                isActive ? "font-bold text-primary" : "hover:underline"
              }
            >
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/users"
              className={({ isActive }) =>
                isActive ? "font-bold text-primary" : "hover:underline"
              }
            >
              Users
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/products"
              className={({ isActive }) =>
                isActive ? "font-bold text-primary" : "hover:underline"
              }
            >
              Products
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/orders"
              className={({ isActive }) =>
                isActive ? "font-bold text-primary" : "hover:underline"
              }
            >
              Orders
            </NavLink>
          </li>
        </ul>
        <button
          onClick={logout}
          className="mt-6 px-4 py-2 bg-red-500 text-white rounded"
        >
          Logout
        </button>
      </nav>
      <main className="flex-1 p-6 bg-background">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
