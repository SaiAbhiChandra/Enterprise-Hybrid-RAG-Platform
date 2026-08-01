import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";

type Props = {
  children: React.ReactNode;
};

export default function MainLayout({
  children,
}: Props) {

  return (
    <div className="flex h-screen bg-slate-950 text-white">

      <Sidebar />

      <div className="flex flex-col flex-1">

        <Topbar />

        <main className="flex-1 overflow-auto p-8">

          {children}

        </main>

      </div>

    </div>
  );
}