"use client";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useRef, useState } from "react";
import Diamond from "@images/rank/diamond.png";
import avatar from "@images/avatar.png";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { BsBookmarkFill, BsDot } from "react-icons/bs";
import Link from "next/link";
import { toast } from "react-toastify";
import { formatDate, formatDateLastActivity } from "@/utils/FormatDate";
import type { Thread } from "@/app/thread/[id]/page";
import { useQuery } from "@tanstack/react-query";
import { getUserIdFromToken } from "@/utils/Helpers";
import useFetchUser from "@/hooks/useFetchUser";
import { useParams } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ChatModal from "@/components/chatmodal/ChatModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type UserInfo = {
  userName: string;
  avatarUrl: string;
  reactionScore: number;
  lastActivity: string;
};

type ViewedThread = {
  threadId: number;
  threadName: string;
  content: string;
  tag: string;
  displayName: string;
  threadContent: string;
  forumName: string;
  createdAt: string;
};

type SavedThread = {
  id: number;
  userId: string;
  displayName: string;
  tag: string;
  threadId: number;
  threadName: string;
  threadContent: string;
  forumName: string;
  createdAt: string;
  savedAt: string;
};

const Profile = () => {
  const params = useParams();
  const [isActive, setIsActive] = useState("All");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [viewedThread, setViewedThread] = useState<ViewedThread[]>([]);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [savedThread, setSavedThread] = useState<SavedThread[]>([]);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);

  const userIdFromUrl = params.id as string;
  const userIdFromToken = getUserIdFromToken();
  const userId = userIdFromUrl || userIdFromToken;

  const { data: userInfo, isLoading, isError } = useFetchUser(userId || "");

  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleUpload = async () => {
    // setIsLoading(true);
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      alert("Please select a file first!");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/Account/upload-avatar?userId=${userId}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (res.status === 200) {
        const data = await res.json();
        toast.success("Upload avatar thành công");
      } else {
        throw new Error("Failed to upload avatar.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload avatar.");
    } finally {
      // setIsLoading(false);
      // useFetchUser(userId || ""); // Removed hook call from finally block
    }
  };

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const fetchViewedThread = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/ViewedThread?userId=${userId}`
      );
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await res.json();
      setViewedThread(data.data);
    } catch (error) {
      console.error("There was an error!", error);
    }
  };

  const { data: viewedThreadData } = useQuery({
    queryKey: ["viewedThread"],
    queryFn: fetchViewedThread,
  });

  const fetchThreadByUserId = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/Thread/GetThreadByUserId?userId=${userId}`
      );
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await res.json();
      setThreads(data.data);
      console.log(data.data);
    } catch (error) {
      console.error("There was an error!", error);
    }
  };

  const fetchSavedThread = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/SavedThread/${userId}`
      );
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await res.json();
      setSavedThread(data.data);
    } catch (error) {
      console.error("There was an error!", error);
    }
  };

  const handleChatClick = () => {
    setIsChatModalOpen(true);
  };

  useEffect(() => {
    // fetchUser();
    fetchViewedThread();
    fetchThreadByUserId();
    fetchSavedThread();
  }, [userId]);

  if (isLoading) {
    return <div>Đang test ReactQuery</div>;
  }

  if (isError) {
    return <div>Đã có lỗi xảy ra</div>;
  }

  return (
    <>
      <div className="container">
        <div className="my-3">
          {userInfo && (
            <Card className="relative my-3 overflow-hidden rounded-none border-none">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 bg-[#DCE7F5] py-3 dark:bg-[#1E2122] md:flex">
                  <div className="block py-4 md:px-7 lg:absolute">
                    <input
                      type="file"
                      name=""
                      id=""
                      ref={fileInputRef}
                      className="hidden"
                      onChange={handleUpload}
                    />
                    <Avatar className="m-auto h-[120px] w-[120px] md:h-[140px] md:w-[140px]">
                      <AvatarImage
                        src={
                          userInfo?.avatarUrl && userInfo.avatarUrl !== ""
                            ? userInfo.avatarUrl
                            : undefined
                        }
                        alt={userInfo?.displayName || "Avatar người dùng"}
                      />
                      <AvatarFallback>
                        {userInfo?.displayName?.charAt(0) || "?"}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex flex-col items-center md:ml-48 md:block">
                    <div className="flex justify-between">
                      <p className="text-xl font-semibold">
                        {userInfo.displayName}
                      </p>
                    </div>
                    <div className="gap-2">
                      <span>Kim Cương</span>
                      <Image
                        src={Diamond || "/placeholder.svg"}
                        alt="rank"
                        width={40}
                        height={40}
                        className="inline-block"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="my-1 text-gray-400">
                        Ngày tham gia:{" "}
                        <span className="text-black dark:text-gray-300">
                          21/7/2024
                        </span>
                      </p>
                      <BsDot />
                      <p className="text-gray-400">
                        Hoạt động cuối:{" "}
                        <span className="text-black dark:text-gray-300">
                          {formatDateLastActivity(userInfo.lastActivity)}
                        </span>
                      </p>
                    </div>
                  </div>
                  {userIdFromUrl === userIdFromToken ? (
                    <div className="m-auto flex-1 text-end md:m-0">
                      <Button
                        className="rounded-none bg-[#ebeced] hover:bg-transparent md:mr-5"
                        onClick={handleAvatarClick}
                      >
                        Đổi Avatar
                      </Button>
                      <Button className="rounded-none bg-[#ebeced] hover:bg-transparent md:mr-5">
                        Report
                      </Button>
                    </div>
                  ) : (
                    <div className="m-auto flex-1 text-end md:m-0">
                      <Button
                        className="rounded-none bg-[#ebeced] hover:bg-transparent md:mr-5"
                        onClick={handleChatClick}
                      >
                        Chat
                      </Button>
                    </div>
                  )}
                </div>
                <div className="bg-[#EBECED] py-2 dark:border-t dark:border-gray-700 dark:bg-[#1d1f20]">
                  <div className="py-2 md:ml-48">
                    <div className="flex justify-center gap-4 md:justify-between">
                      <div className="text-center">
                        <p className="text-gray-400">Tin nhắn</p>
                        <span className="dark:text-gray-300">10</span>
                      </div>
                      <div className="text-center md:flex-grow">
                        <p className="text-gray-400">Điểm rank</p>
                        <span className="dark:text-gray-300">
                          {userInfo.reactionScore}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex-row space-y-0 bg-[#23497C] p-0 outline-none dark:bg-[#1d1f20]">
                  <button
                    className={`${
                      isActive === "All" &&
                      "border-b-[3px] border-sky-300 bg-[#e8f4fc1a] !text-white"
                    }  px-3 py-2 text-[18px] text-[#869bbf] transition hover:bg-[#e8f4fc1a] hover:text-white`}
                    onClick={() => setIsActive("All")}
                  >
                    Đã xem gần đây
                  </button>
                  <button
                    className={`${
                      isActive === "Threads" &&
                      "border-b-[3px] border-sky-300 bg-[#e8f4fc1a] !text-white"
                    }  px-3 py-2 text-[18px] text-[#869bbf] transition hover:bg-[#e8f4fc1a] hover:text-white`}
                    onClick={() => setIsActive("Threads")}
                  >
                    Thread đã đăng
                  </button>{" "}
                  <button
                    className={`${
                      isActive === "Save" &&
                      "border-b-[3px] border-sky-300 bg-[#e8f4fc1a] !text-white"
                    }  px-3 py-2 text-[18px] text-[#869bbf] transition hover:bg-[#e8f4fc1a] hover:text-white`}
                    onClick={() => setIsActive("Save")}
                  >
                    Thread đã lưu
                  </button>
                </div>
              </CardContent>
            </Card>
          )}
          {isActive === "All" && (
            <Card className="mt-3 rounded-none border-none bg-[#EBECED] dark:bg-[#1d1f20]">
              <CardContent className="p-0">
                {viewedThread.map((thread) => (
                  <Link
                    key={thread.threadId}
                    href={`/thread/${thread.threadId}`}
                    className="flex cursor-pointer gap-2 border-b border-[#b5b9bd] px-4 py-2 dark:border-[#3e4346]"
                  >
                    <div className="flex gap-3">
                      <div className="flex items-start">
                        <Image
                          src={userInfo?.avatarUrl || avatar}
                          alt="avatar"
                          width={45}
                          height={45}
                          className="h-14 w-14 rounded-full"
                        />
                      </div>
                      <div>
                        <div className="line-clamp-1 py-[2px] text-[16px]">
                          <span className="mr-1 rounded-sm border border-solid border-sky-500 bg-[#dce7f5] p-[3px] text-xs font-medium dark:bg-transparent">
                            {thread.tag}
                          </span>
                          {thread.threadName}
                        </div>
                        <div className="my-1">
                          <div
                            className="line-clamp-1 text-black dark:text-gray-300"
                            dangerouslySetInnerHTML={{
                              __html: thread.threadContent,
                            }}
                          ></div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center text-gray-400">
                            <p>{thread.displayName}</p>
                            <BsDot />
                            <p>{formatDate(thread.createdAt)}</p>
                            <BsDot />
                            <p>Forum: {thread.forumName}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          )}

          {isActive === "Threads" && (
            <Card className="mt-3 rounded-none border-none bg-[#EBECED] dark:bg-[#1d1f20]">
              <CardContent className="p-0">
                {threads.map((thread) => (
                  <Link
                    key={thread.id}
                    href={`/thread/${thread.id}`}
                    className="flex cursor-pointer flex-col gap-2 border-b border-[#b5b9bd] px-4 py-2 dark:border-[#3e4346]"
                  >
                    <div className="flex gap-3">
                      <div className="flex items-start">
                        <Image
                          src={userInfo?.avatarUrl || avatar}
                          alt="avatar"
                          width={45}
                          height={45}
                          className="rounded-full"
                        />
                      </div>
                      <div className="flex flex-col">
                        <div className="line-clamp-1 py-[2px] text-[16px]">
                          <span className="mr-1 rounded-sm border border-solid border-sky-500 bg-[#dce7f5] p-[3px] text-xs font-medium dark:bg-transparent">
                            {thread.tag}
                          </span>
                          {thread.title}
                        </div>
                        <div className="my-1">
                          <div
                            className="line-clamp-1 text-black dark:text-gray-300"
                            dangerouslySetInnerHTML={{ __html: thread.content }}
                          ></div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center text-[13px] text-gray-400 md:text-[18px]">
                            <p>{thread.displayName}</p>
                            <BsDot />
                            <p>{formatDate(thread.createdAt)}</p>
                            <BsDot />
                            <p>Forum: {thread.forumName}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          )}

          {isActive === "Save" && (
            <Card className="mt-3 rounded-none border-none bg-[#EBECED] dark:bg-[#1d1f20]">
              <CardContent className="p-0">
                {savedThread.map((thread) => (
                  <Link
                    key={thread.id}
                    href={`/thread/${thread.id}`}
                    className="flex cursor-pointer flex-col gap-2 border-b border-[#b5b9bd] px-4 py-2 dark:border-[#3e4346]"
                  >
                    <div className="flex gap-3">
                      <div className="flex items-start">
                        <Image
                          src={userInfo?.avatarUrl || avatar}
                          alt="avatar"
                          width={45}
                          height={45}
                          className="rounded-full"
                        />
                      </div>
                      <div className="flex flex-col">
                        <div className="line-clamp-1 py-[2px] text-[16px]">
                          <span className="mr-1 rounded-sm border border-solid border-sky-500 bg-[#dce7f5] p-[3px] text-xs font-medium dark:bg-transparent">
                            {thread.tag}
                          </span>
                          {thread.threadName}
                        </div>
                        <div className="my-1">
                          <div
                            className="line-clamp-1 text-black dark:text-gray-300"
                            dangerouslySetInnerHTML={{
                              __html: thread.threadContent,
                            }}
                          ></div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center text-[13px] text-gray-400 md:text-[18px]">
                            <p>{thread.displayName}</p>
                            <BsDot />
                            <p>{formatDate(thread.createdAt)}</p>
                            <BsDot />
                            <p>Forum: {thread.forumName}</p>
                          </div>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="flex items-center gap-1.5 text-[13px] text-emerald-600 dark:text-emerald-400">
                                  <BsBookmarkFill className="h-3.5 w-3.5" />
                                  <span>
                                    {formatDateLastActivity(thread.savedAt)}
                                  </span>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent className="bg-white">
                                <p>
                                  Đã lưu vào:{" "}
                                  {new Date(thread.savedAt).toLocaleString(
                                    "vi-VN"
                                  )}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Chat Modal */}
      {userInfo && (
        <ChatModal
          isOpen={isChatModalOpen}
          onClose={() => setIsChatModalOpen(false)}
          targetUser={{
            id: userId || "",
            displayName: userInfo.displayName,
            avatarUrl:
              userInfo.avatarUrl || "/placeholder.svg?height=40&width=40",
          }}
        />
      )}
    </>
  );
};

export default Profile;
