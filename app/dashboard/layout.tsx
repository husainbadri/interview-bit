import Navbar from "@/components/landing/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#fafafa] text-[#141414]">
      <Navbar />
      <main className="pt-24 px-4 sm:px-6 lg:px-8 max-w-[1240px] mx-auto pb-20">
        {children}
      </main>
    </div>
  );
}
