import Sidebar from "@/components/core/sidebar";

export default function CoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 bg-muted/40 p-6">
        {children}
      </main>
    </div>
  );
}
