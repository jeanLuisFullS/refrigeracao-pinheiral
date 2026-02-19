"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/visitantes", label: "Visitantes" },
  { href: "/admin/formularios", label: "Formulários" },
  { href: "/admin/produtos", label: "Produtos" },
  { href: "/admin/config", label: "Configuração" },
  { href: "/admin/depoimentos", label: "Depoimentos" },
  { href: "/admin/manutencao", label: "Manutenção" },
  { href: "/admin/alertas", label: "Alertas" },
  { href: "/admin/trocar-senha", label: "Trocar senha" },
];

export default function AdminLayout(props: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (pathname === "/admin/login") {
      setChecking(false);
      return;
    }
    fetch("/api/admin/me", { credentials: "include" })
      .then((r) => {
        if (!r.ok) router.replace("/admin/login");
        setChecking(false);
      })
      .catch(() => {
        router.replace("/admin/login");
        setChecking(false);
      });
  }, [pathname, router]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST", credentials: "include" });
    router.replace("/admin/login");
    router.refresh();
  };

  if (pathname === "/admin/login") return <>{props.children}</>;
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <p className="text-slate-400">Carregando...</p>
      </div>
    );
  }

  const navContent = (
    <>
      <div className="p-4 border-b border-slate-700">
        <Link href="/admin" className="font-bold text-white text-lg">Admin</Link>
      </div>
      <nav className="p-2 flex-1 overflow-auto">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={"block px-3 py-3 rounded-lg text-sm min-h-[44px] flex items-center " + (pathname === link.href ? "bg-teal-600 text-white" : "text-slate-400 hover:bg-slate-700 hover:text-white")}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="p-2 border-t border-slate-700">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full px-3 py-3 rounded-lg text-sm text-slate-400 hover:bg-slate-700 hover:text-white text-left min-h-[44px]"
        >
          Sair
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex bg-slate-900">
      {/* Sidebar desktop */}
      <aside className="hidden md:flex w-56 bg-slate-800 border-r border-slate-700 flex-col flex-shrink-0">
        {navContent}
      </aside>

      {/* Mobile: menu hambúrguer + overlay */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-slate-800 border-b border-slate-700 flex items-center px-4">
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className="p-2 -ml-2 text-white rounded-lg hover:bg-slate-700"
          aria-label="Abrir menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <Link href="/admin" className="font-bold text-white ml-2">Admin</Link>
      </div>
      {menuOpen && (
        <>
          <div className="md:hidden fixed inset-0 z-50 bg-black/60" onClick={() => setMenuOpen(false)} aria-hidden />
          <aside className="md:hidden fixed top-0 left-0 z-50 w-72 max-w-[85vw] h-full bg-slate-800 border-r border-slate-700 flex flex-col shadow-xl">
            {navContent}
          </aside>
        </>
      )}

      <main className="flex-1 overflow-auto p-4 md:p-6 pt-16 md:pt-6 min-h-screen">
        {props.children}
      </main>
    </div>
  );
}
