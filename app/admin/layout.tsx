"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Users,
  FileText,
  ShoppingBag,
  Settings,
  MessageSquare,
  Wrench,
  Bell,
  KeyRound,
  LogOut,
  Menu,
} from "lucide-react";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/visitantes", label: "Visitantes", icon: Users },
  { href: "/admin/formularios", label: "Formulários", icon: FileText },
  { href: "/admin/produtos", label: "Produtos", icon: ShoppingBag },
  { href: "/admin/config", label: "Configuração", icon: Settings },
  { href: "/admin/depoimentos", label: "Depoimentos", icon: MessageSquare },
  { href: "/admin/manutencao", label: "Manutenção", icon: Wrench },
  { href: "/admin/alertas", label: "Alertas", icon: Bell },
  { href: "/admin/trocar-senha", label: "Trocar senha", icon: KeyRound },
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
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={"block px-3 py-3 rounded-lg text-sm min-h-[44px] flex items-center gap-2 " + (pathname === link.href ? "bg-teal-600 text-white" : "text-slate-400 hover:bg-slate-700 hover:text-white")}
            >
              <Icon className="w-5 h-5" />
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-2 border-t border-slate-700">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full px-3 py-3 rounded-lg text-sm text-slate-400 hover:bg-slate-700 hover:text-white text-left min-h-[44px] flex items-center gap-2"
        >
          <LogOut className="w-5 h-5" />
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
          <Menu className="w-6 h-6" />
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
