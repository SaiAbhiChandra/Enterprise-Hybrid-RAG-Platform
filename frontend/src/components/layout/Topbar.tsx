export default function Topbar() {
  return (
    <header className="h-16 border-b border-slate-800 bg-slate-950 flex items-center justify-between px-8">

      <h2 className="text-lg font-semibold">
        Dashboard
      </h2>

      <div className="flex items-center gap-4">

        <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center">
          A
        </div>

      </div>

    </header>
  );
}