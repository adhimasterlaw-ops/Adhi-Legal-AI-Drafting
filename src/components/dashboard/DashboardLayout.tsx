import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  BookOpenCheck,
  ChevronDown,
  CircleHelp,
  FileClock,
  Files,
  FileSearch,
  FileSignature,
  LayoutDashboard,
  LogOut,
  MessageSquareText,
  Scale,
  Search,
  Settings,
  Star,
  UserRound,
} from "lucide-react";
import { useState } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth-context";

const primaryItems = [
  { title: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { title: "Chat Hukum", to: "/dashboard/chat", icon: MessageSquareText },
  { title: "Analisis Kontrak", to: "/dashboard/analisis-kontrak", icon: FileSearch },
  { title: "Draft Dokumen", to: "/dashboard/drafting", icon: FileSignature },
  { title: "Riset Hukum", to: "/dashboard/riset-hukum", icon: BookOpenCheck },
] as const;

const libraryItems = [
  { title: "Riwayat", to: "/dashboard/riwayat", icon: FileClock },
  { title: "Dokumen Saya", to: "/dashboard/documents", icon: Files },
  { title: "Bookmarks", to: "/dashboard/bookmarks", icon: Star },
] as const;

const utilityItems = [
  { title: "Bantuan", to: "/dashboard/bantuan", icon: CircleHelp },
  { title: "Pengaturan", to: "/dashboard/pengaturan", icon: Settings },
] as const;

function SidebarBrand() {
  const { state } = useSidebar();
  return (
    <Link to="/dashboard" className="flex h-14 items-center gap-3 px-2 text-sidebar-foreground">
      <span className="grid size-8 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground">
        <Scale size={18} />
      </span>
      {state !== "collapsed" && (
        <span className="min-w-0 truncate font-display text-sm font-extrabold">
          LegalAI Indonesia
        </span>
      )}
    </Link>
  );
}

function NavigationGroup({
  label,
  items,
}: {
  label: string;
  items: typeof primaryItems | typeof libraryItems | typeof utilityItems;
}) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const { isMobile, setOpenMobile } = useSidebar();
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const active =
              item.to === "/dashboard" ? pathname === item.to : pathname.startsWith(item.to);
            return (
              <SidebarMenuItem key={item.to}>
                <SidebarMenuButton
                  asChild
                  isActive={active}
                  tooltip={item.title}
                  className="h-10 data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
                >
                  <Link to={item.to} onClick={() => isMobile && setOpenMobile(false)}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

function AppSidebar() {
  const { state } = useSidebar();
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <SidebarBrand />
      </SidebarHeader>
      <SidebarContent className="py-2">
        <NavigationGroup label="UTAMA" items={primaryItems} />
        <NavigationGroup label="KOLEKSI" items={libraryItems} />
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border">
        {state !== "collapsed" && (
          <div className="mx-1 mb-2 rounded-md border border-secondary/40 bg-gold-soft p-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-foreground">Paket Gratis</span>
              <span className="text-xs text-muted-foreground">2/5</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-background">
              <div className="h-full w-2/5 rounded-full bg-secondary" />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">3 konsultasi tersisa bulan ini</p>
          </div>
        )}
        <NavigationGroup label="" items={utilityItems} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

function DashboardHeader() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [signingOut, setSigningOut] = useState(false);
  const name = String(
    user?.user_metadata?.["full_name"] || user?.email?.split("@")[0] || "Pengguna",
  );
  const initials =
    name
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "LA";

  async function handleSignOut() {
    setSigningOut(true);
    await queryClient.cancelQueries();
    queryClient.clear();
    await signOut();
    await navigate({ to: "/login", replace: true });
  }

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur">
      <div className="grid h-16 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 sm:flex sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <SidebarTrigger className="size-9 shrink-0" aria-label="Buka atau tutup navigasi" />
          <div className="relative hidden w-full max-w-md sm:block">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={17}
            />
            <input
              aria-label="Cari di dashboard"
              placeholder="Cari percakapan atau dokumen..."
              className="h-10 w-full rounded-md border border-input bg-muted/60 pl-10 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
          </div>
          <p className="truncate font-display text-sm font-bold text-foreground sm:hidden">
            LegalAI Indonesia
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1 sm:ml-auto sm:gap-2">
          <Button variant="ghost" size="icon" className="relative" aria-label="Notifikasi">
            <Bell />
            <span className="absolute right-2 top-2 size-1.5 rounded-full bg-secondary" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-11 max-w-48 gap-2 px-1.5 sm:px-2">
                <Avatar className="size-8">
                  <AvatarFallback className="bg-primary text-xs font-bold text-primary-foreground">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden min-w-0 text-left md:block">
                  <span className="block truncate text-sm font-semibold">{name}</span>
                  <span className="block truncate text-xs font-normal text-muted-foreground">
                    Paket Gratis
                  </span>
                </span>
                <ChevronDown className="hidden md:block" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel>
                <span className="block truncate">{name}</span>
                <span className="block truncate text-xs font-normal text-muted-foreground">
                  {user?.email}
                </span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/dashboard/pengaturan">
                  <UserRound />
                  Profil Saya
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/dashboard/pengaturan">
                  <Settings />
                  Pengaturan
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                disabled={signingOut}
                onSelect={() => void handleSignOut()}
                className="text-destructive focus:text-destructive"
              >
                <LogOut />
                {signingOut ? "Keluar..." : "Keluar"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

export function DashboardLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="min-w-0 bg-muted/45">
        <DashboardHeader />
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
