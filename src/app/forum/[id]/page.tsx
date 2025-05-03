"use client";
import BreadcrumbDetail from "@/components/breadcrumb/Breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaRegComments, FaThumbtack } from "react-icons/fa6";
import { BsDot } from "react-icons/bs";
import avatar from "@images/avatar.png";
import Filter from "@/components/filter/Filter";
import { Button } from "@/components/ui/button";
import PaginationPage from "@/components/pagination/Pagination";
import { FaRegEdit } from "react-icons/fa";
import { formatDate } from "@/utils/FormatDate";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { getUserIdFromToken } from "@/utils/Helpers";

type Thread = {
  id: number;
  title: string;
  isSticky: boolean;
  content: string;
  viewCount: number;
  createdAt: string;
  tag: string;
  displayName: string;
  avatarUrl: string;
  userId: string;
  forumName: string;
  forumId: number;
  totalComments: number;
  lastCommentAt: string;
  lastCommentBy: string;
  lastCommenterAvatarUrl: string;
};

const fetchThreadsByForum = async (forumId: number, pageNumber: number) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/Thread/ThreadsByForum?id=${forumId}&pagenumber=${pageNumber}&pagesize=5`,
    {
      cache: "no-store",
    }
  );
  const data = await res.json();
  return {
    threads: data.data,
    totalPages: data.totalPages,
  };
};

const SkeletonLoader = () => {
  return (
    <div className="my-3">
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className="grid grid-cols-6 gap-2 border-b border-[#d3d5d7] px-4 py-2 dark:border-[#3e4346]"
        >
          <div className="col-span-4 flex gap-3">
            <div className="h-[50px] w-[50px] animate-pulse rounded-full bg-gray-300"></div>
            <div className="flex-1">
              <div className="mb-2 h-[20px] w-1/2 animate-pulse rounded bg-gray-300"></div>
              <div className="h-[15px] w-1/3 animate-pulse rounded bg-gray-300"></div>
            </div>
          </div>
          <div className="col-span-1">
            <div className="mb-2 h-[15px] w-1/2 animate-pulse rounded bg-gray-300"></div>
            <div className="h-[15px] w-1/3 animate-pulse rounded bg-gray-300"></div>
          </div>
          <div className="col-span-1">
            <div className="mb-2 h-[15px] w-1/2 animate-pulse rounded bg-gray-300"></div>
            <div className="h-[30px] w-[30px] animate-pulse rounded-full bg-gray-300"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

const ForumDetail = ({ params }: { params: { id: number } }) => {
  const userId = getUserIdFromToken();

  console.log("userId", userId);

  const recordThreadView = async (threadId: number) => {
    if (!userId) {
      console.error("User is not logged in. Cannot record thread view.");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/Thread/RecordViewedThread?userId=${userId}&threadId=${threadId}`,
        {
          method: "POST", // Phương thức POST vẫn được giữ nguyên
        }
      );

      if (!res.ok) {
        throw new Error("Failed to record thread view");
      }

      console.log("Thread view recorded successfully");
    } catch (error) {
      console.error("Error recording thread view:", error);
    }
  };

  const searchParams = useSearchParams();
  const pageNumber = searchParams.get("page")
    ? Number(searchParams.get("page"))
    : 1;

  const { data, error, isLoading } = useQuery({
    queryKey: ["threads", params.id, pageNumber],
    queryFn: () => fetchThreadsByForum(params.id, pageNumber),
  });

  if (isLoading) {
    return (
      <div className="container">
        {" "}
        <SkeletonLoader />
      </div>
    );
  }

  if (error) {
    return <div>Error loading threads</div>;
  }

  if (!data) {
    return <div>No data available</div>;
  }

  const { threads, totalPages } = data;

  const paths = [{ url: "/", label: "Forums" }];
  const currentPage = threads[0]?.forumName || "Forum";
  const forumId = threads[0]?.forumId || params.id;

  const getTagClasses = (tag: string) => {
    switch (tag) {
      case "Thảo luận":
        return "border-sky-500 bg-[#dce7f5]";
      case "Thắc mắc":
        return "border-yellow-500 bg-yellow-100";
      case "Kiến thức":
        return "border-blue-500 bg-blue-100";
      default:
        return "";
    }
  };

  return (
    <>
      <div className="container">
        <div className="my-3">
          <BreadcrumbDetail paths={paths} currentPage={currentPage} />
          <div className="flex justify-between">
            <h1 className="mt-2 text-2xl text-black">{currentPage}</h1>
            <Link href={`/post?Id=${forumId}&Forum=${currentPage}`}>
              <Button className="flex items-center gap-1 bg-yellow-500 text-white hover:bg-yellow-600">
                <FaRegEdit />
                Tạo thread
              </Button>
            </Link>
          </div>
          <div>
            <Card className="my-3 overflow-hidden rounded-none border-none shadow-none">
              {/* <CardHeader className="border-b border-[#d3d5d7] bg-fuchsia-50 px-4 py-1 outline-none dark:border-[#3e4346] dark:bg-[#1d1f20]">
                <Filter />
              </CardHeader> */}
              <CardContent className="p-0">
                {threads.map((thread: Thread) => (
                  <Link
                    href={`/thread/${thread.id}`}
                    key={thread.id}
                    className="grid cursor-pointer grid-cols-6 gap-2 border-b border-[#d3d5d7] px-4 py-2 dark:border-[#3e4346]"
                    onClick={() => recordThreadView(thread.id)}
                  >
                    <div className="col-span-4 flex gap-3">
                      <div className="flex items-center">
                        <Image
                          src={thread.avatarUrl || avatar}
                          alt="avatar"
                          width={50}
                          height={50}
                          className="rounded-full"
                        />
                      </div>
                      <div>
                        <div className="line-clamp-1 py-[2px] text-[16px]">
                          <span
                            className={`mr-1 rounded-sm border border-solid  p-[3px] text-xs font-medium dark:bg-transparent ${getTagClasses(
                              thread.tag
                            )}`}
                          >
                            {thread.tag}
                          </span>
                          <span className="hover:text-amber-500 hover:underline">
                            {thread.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            <p className="text-gray-400">
                              {thread.displayName}
                            </p>
                            <BsDot />
                            <p>{formatDate(thread.createdAt)}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button className="h-[15px] rounded-sm bg-zinc-100 px-1 py-2 text-xs text-gray-500 shadow-none hover:bg-zinc-200">
                              1111
                            </Button>
                            <Button className="h-[15px] rounded-sm bg-zinc-100 px-1 py-2 text-xs text-gray-500 shadow-none hover:bg-zinc-200">
                              2
                            </Button>
                            <Button className="h-[15px] rounded-sm bg-zinc-100 px-1 py-2 text-xs text-gray-500 shadow-none hover:bg-zinc-200">
                              3
                            </Button>
                          </div>
                        </div>
                      </div>
                      {thread.isSticky && (
                        <div className="flex flex-1 justify-end pr-2">
                          <FaThumbtack
                            color="#9ca3af"
                            size={20}
                            className="mt-[7px]"
                          />
                        </div>
                      )}
                    </div>
                    <div className="col-span-1 max-w-32">
                      <div>
                        <div className="flex items-center justify-between">
                          <p className="text-gray-400">Trả lời:</p>
                          <span className="dark:text-amber-50">
                            {thread.totalComments}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-gray-400">Lượt xem:</p>
                          <span className="dark:text-amber-50">
                            {thread.viewCount}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="col-span-1">
                      <div className="flex items-center gap-5">
                        <div className="flex flex-1 flex-col items-end">
                          <p className="text-[16px] font-medium">
                            {formatDate(thread.lastCommentAt)}
                          </p>
                          <p className="text-[14px]">{thread.lastCommentBy}</p>
                        </div>
                        <div className="flex justify-end">
                          <Image
                            src={thread.lastCommenterAvatarUrl || avatar}
                            alt="avatar"
                            width={30}
                            height={30}
                            className="h-[30px] rounded-full"
                          />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>
          {totalPages > 1 && (
            <PaginationPage totalPages={totalPages} pageNumber={pageNumber} />
          )}
        </div>
      </div>
    </>
  );
};

export default ForumDetail;
