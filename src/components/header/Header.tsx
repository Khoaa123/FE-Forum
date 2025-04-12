"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import logo from "@images/logo/voz-logo.png";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { ThemeToggle } from "../theme-toggle";
import { useTheme } from "next-themes";
import { CiMail, CiBellOn } from "react-icons/ci";
import Link from "next/link";
import { useCookies } from "next-client-cookies";
import { useUserStore } from "@/store/User";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const { theme } = useTheme();
  const { setDisplayName, displayName, isLogin, userId } = useUserStore();
  const cookies = useCookies();

  useEffect(() => {
    const token = cookies.get("accessToken");
    if (token) {
      setDisplayName(token);
    }
  }, [cookies, setDisplayName]);

  const handleLogout = () => {
    cookies.remove("accessToken");
    cookies.remove("refreshToken");
    setDisplayName("");
    useUserStore.setState({ isLogin: false });
  };

  return (
    <>
      <div className="bg-[#0f578a] pt-3">
        <div className="container">
          <Link href="/">
            <Image src={logo} alt="logo" width={70} height={45} priority />
          </Link>
          <div className="mt-2 flex justify-between">
            <div>
              <Button className="rounded-none bg-white text-[16px] font-semibold text-[#1474b8] shadow-none hover:bg-white dark:bg-[#1D1F20] hover:dark:bg-[#1D1F20]">
                Forums
              </Button>
              <Button className="rounded-none bg-transparent text-[16px] text-sky-300 transition duration-200 hover:bg-[#a3d4f50f] dark:shadow-none">
                Mới nhất
              </Button>
            </div>
            <div className="flex gap-2">
              {isLogin ? (
                <div className="flex items-center">
                  <div>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        asChild
                        className="focus-visible:ring-0"
                      >
                        <Button className="rounded-none bg-[#14141426] text-sky-200 transition duration-200 hover:bg-[#0f4367] dark:text-[#8cb6de]">
                          {displayName}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>Quản lý cá nhân</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                          <Link href={`/profile/${userId}`}>
                            <DropdownMenuItem>Trang cá nhân</DropdownMenuItem>
                          </Link>
                          {/* <DropdownMenuItem>
                            Billing
                            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            Settings
                            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            Keyboard shortcuts
                            <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
                          </DropdownMenuItem> */}
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                          {/* <DropdownMenuItem>Team</DropdownMenuItem>
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                              Invite users
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent>
                                <DropdownMenuItem>Email</DropdownMenuItem>
                                <DropdownMenuItem>Message</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>More...</DropdownMenuItem>
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>
                          <DropdownMenuItem>
                            New Team
                            <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
                          </DropdownMenuItem> */}
                        </DropdownMenuGroup>
                        {/* <DropdownMenuSeparator /> */}
                        {/* <DropdownMenuItem>GitHub</DropdownMenuItem>
                        <DropdownMenuItem>Support</DropdownMenuItem>
                        <DropdownMenuItem disabled>API</DropdownMenuItem> */}
                        {/* <DropdownMenuSeparator /> */}
                        <DropdownMenuItem onClick={handleLogout}>
                          Đăng xuất
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  {/* </Button> */}
                  <Button className="rounded-none bg-[#14141426] text-sky-200 transition duration-200 hover:bg-[#0f4367] dark:text-[#8cb6de]">
                    <CiMail size={20} />
                  </Button>
                  <Button className="rounded-none bg-[#14141426] text-sky-200 transition duration-200 hover:bg-[#0f4367] dark:text-[#8cb6de]">
                    <CiBellOn size={20} />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center">
                  <Link href="/login">
                    <Button className="rounded-none bg-[#14141426] text-sky-200 transition duration-200 hover:bg-[#0f4367] dark:text-[#8cb6de]">
                      Đăng nhập
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button className="rounded-none bg-[#14141426] text-sky-200 transition duration-200 hover:bg-[#0f4367] dark:text-[#8cb6de]">
                      Đăng ký
                    </Button>
                  </Link>
                </div>
              )}
              <Link href="/search">
                <Button className="rounded-none bg-[#14141426] text-sky-200 transition duration-200 hover:bg-[#0f4367] dark:text-[#8cb6de]">
                  Search
                </Button>
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>

        <Card className="rounded-none py-2 shadow-none">
          <div className="container">
            <div className="flex gap-3">
              <div>
                <Button className="h-0 bg-transparent p-0 text-sky-600">
                  Post mới
                </Button>
              </div>
              <div>
                <Button className="h-0 bg-transparent p-0">Tìm kiếm</Button>
              </div>
              {/* <div>
                <Button className="h-0 bg-transparent p-0">Post mới</Button>
              </div>
              <div>
                <Button className="h-0 bg-transparent p-0">Post mới</Button>
              </div> */}
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default Header;
