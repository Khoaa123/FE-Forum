"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import { LuLogIn } from "react-icons/lu";
import { useRouter } from "next/navigation";
import { useCookies } from "next-client-cookies";
import { toast } from "react-toastify";
import { useUserStore } from "@/store/User";

const LoginForm = () => {
  const [userName, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();
  const cookies = useCookies();

  const { setDisplayName } = useUserStore();

  const login = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/Account/Login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ UserName: userName, Password: password }),
      }
    );
    if (res.status === 200) {
      const data = await res.json();

      cookies.set("accessToken", data.data.accessToken);
      cookies.set("refreshToken", data.data.refreshToken);

      setDisplayName(data.data.accessToken);

      toast.success("Đăng nhập thành công");
      router.push("/");
    } else {
      toast.error("Login failed");
    }
  };

  return (
    <>
      <div className="container">
        <div className="my-3">
          <div>
            <Card className="my-3 overflow-hidden rounded-none border-none">
              <CardHeader className="bg-reaction-comment flex-row space-y-0 p-0 outline-none dark:bg-[#1d1f20]">
                <button className="px-3 py-2 text-2xl font-medium text-white transition hover:bg-[#e8f4fc1a]">
                  Đăng nhập
                </button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="grid lg:grid-cols-3">
                  <div className="col-span-1 border-r border-[#cbcdd0] bg-[#E2E3E5] px-3 py-7 text-right text-black">
                    Tài khoản:
                  </div>
                  <div className="col-span-2 bg-[#EBECED] px-3 py-5">
                    <input
                      type="text"
                      className="w-full rounded-md border border-solid border-[#b5b9bd] bg-[#e5eaf0] p-2 text-black focus:border-sky-500 focus-visible:outline-none"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid lg:grid-cols-3">
                  <div className="col-span-1 border-r border-[#cbcdd0] bg-[#E2E3E5] px-3 py-7 text-right text-black">
                    Mật khẩu:
                  </div>
                  <div className="col-span-2 bg-[#EBECED] px-3 py-5">
                    <input
                      type="password"
                      className="w-full rounded-md border border-solid border-[#b5b9bd] bg-[#e5eaf0] p-2 text-black focus:border-sky-500 focus-visible:outline-none"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid lg:grid-cols-3">
                  <div className="col-span-1 border-r border-[#cbcdd0] bg-[#E2E3E5] px-3 py-7 text-right text-black"></div>
                  <div className="col-span-2 bg-[#EBECED] px-3 py-5">
                    <Button
                      className="gap-2 bg-[#5c7099] text-white hover:bg-[#4d5d80]"
                      onClick={login}
                    >
                      <LuLogIn color="white" size={20} />
                      Đăng nhập
                    </Button>
                    <div className="mt-3">
                      <p className="text-black">
                        Chưa có tài khoản?{" "}
                        <Link href="/register" className="text-blue-500">
                          Đăng ký
                        </Link>
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
