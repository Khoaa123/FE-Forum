"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/header/Header";
import ProgressBarProvider from "@/components/progressBarProvider/ProgressBarProvider";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "@/components/theme-provider";
import "react-toastify/dist/ReactToastify.css";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isChatRoute = pathname.startsWith("/chat");

  return (
    <div className="flex h-screen flex-col">
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        {!isDashboardRoute && !isChatRoute && <Header />}
        <ProgressBarProvider>{children}</ProgressBarProvider>
        <ToastContainer closeOnClick draggable />
      </ThemeProvider>
    </div>
  );
}
