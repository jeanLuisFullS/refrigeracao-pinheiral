"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function MaintenanceGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [maintenance, setMaintenance] = useState<{ enabled: boolean; message?: string } | null>(null);

  useEffect(() => {
    fetch("/api/maintenance")
      .then((r) => r.json())
      .then(setMaintenance)
      .catch(() => setMaintenance({ enabled: false }));
  }, []);

  if (maintenance === null) return null;
  if (maintenance.enabled && pathname && !pathname.startsWith("/admin")) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Site em manutenção</h1>
          <p className="text-slate-600">
            {maintenance.message || "Voltamos em breve. Obrigado pela compreensão."}
          </p>
        </div>
      </div>
    );
  }
  return <>{children}</>;
}
