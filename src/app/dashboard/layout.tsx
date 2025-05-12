"use client";

import type React from "react";

import { usePathname } from "next/navigation";
import {
  BarChart3,
  Users,
  MessageSquare,
  Flag,
  Settings,
  ShieldAlert,
  FileText,
  Tag,
  LogOut,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const routes = [
    {
      icon: BarChart3,
      label: "Bảng điều khiển",
      href: "/dashboard",
      active: pathname === "/dashboard",
    },
    {
      icon: Users,
      label: "Người dùng",
      href: "/dashboard/users",
      active: pathname === "/dashboard/users",
    },
    {
      icon: MessageSquare,
      label: "Bài viết",
      href: "/dashboard/posts",
      active: pathname === "/dashboard/posts",
    },
    {
      icon: FileText,
      label: "Chủ đề",
      href: "/dashboard/threads",
      active: pathname === "/dashboard/threads",
    },
    {
      icon: Tag,
      label: "Danh mục",
      href: "/dashboard/categories",
      active: pathname === "/dashboard/categories",
    },
    {
      icon: Flag,
      label: "Báo cáo",
      href: "/dashboard/reports",
      active: pathname === "/dashboard/reports",
    },
    // {
    //   icon: ShieldAlert,
    //   label: "Moderation",
    //   href: "/dashboard/moderation",
    //   active: pathname === "/dashboard/moderation",
    // },
    // {
    //   icon: Settings,
    //   label: "Settings",
    //   href: "/dashboard/settings",
    //   active: pathname === "/dashboard/settings",
    // },
  ];

  return (
    <SidebarProvider>
      <div className="flex overflow-hidden">
        <Sidebar>
          <SidebarHeader className="border-b border-border">
            <div className="flex items-center gap-2 px-2 py-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary bg-white text-primary-foreground">
                <MessageSquare className="h-4 w-4" />
              </div>
              <div className="font-semibold">Forum Admin</div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {routes.map((route) => (
                <SidebarMenuItem key={route.href}>
                  <SidebarMenuButton asChild isActive={route.active}>
                    <a href={route.href}>
                      <route.icon className="h-4 w-4" />
                      <span>{route.label}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="border-t border-border p-2">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Avatar className="h-6 w-6">
                    <AvatarImage
                      src="/placeholder.svg?height=32&width=32"
                      alt="Admin"
                    />
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                  <span>Admin User</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/logout">
                    <LogOut className="h-4 w-4" />
                    <span>Đăng xuất</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <div className="flex flex-1 flex-col overflow-hidden">
          <header className="flex h-14 items-center gap-4 border-b bg-white px-4 lg:h-[60px] lg:px-6">
            <SidebarTrigger />
          </header>
          <main className="h-svh bg-white p-4 lg:p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
