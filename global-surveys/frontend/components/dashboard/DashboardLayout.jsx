import Sidebar from "@/components/dashboard/sideBar";
import DashFooter from "./dashFooter";
import DashNavbar from "./dashNavbar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Sidebar />
      <DashNavbar />
      <main className="pl-64 pt-16">
        {" "}
        {/* Adjust padding based on sidebar width */}
        <div className="p-6">{children}</div>
      </main>
      <DashFooter />
    </div>
  );
}
