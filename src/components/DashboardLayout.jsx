export default function DashboardLayout({
  header,
  children,
}) {
  return (
    <div className="min-h-screen bg-[#07111F] text-white">

      {header}

      <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pb-24">

        {children}

      </main>

    </div>
  );
}
