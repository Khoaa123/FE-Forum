"use client";
import React from "react";
import BreadcrumbDetail from "../breadcrumb/Breadcrumb";
import { FiUser } from "react-icons/fi";
import PaginationPage from "../pagination/Pagination";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import { Button } from "react-day-picker";
import { formatDate } from "@/utils/FormatDate";
import { BsDot, BsReply } from "react-icons/bs";
import CommentThread from "../commentThread/CommentThread";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Thread } from "@/app/thread/[id]/page";
import { IoMdTime } from "react-icons/io";
import avatar from "@images/avatardefault.png";
import { getUserIdFromToken } from "@/utils/Helpers";
import useFetchUser from "@/hooks/useFetchUser";

const SkeletonLoader = () => {
  return (
    <div className="my-3">
      <div className="animate-pulse">
        <div className="mb-4 h-6 w-1/3 rounded bg-gray-300"></div>
        <div className="mb-4 flex items-center gap-2">
          <div className="h-6 w-16 rounded bg-gray-300"></div>
          <div className="h-8 w-2/3 rounded bg-gray-300"></div>
        </div>
        <div className="mb-4 flex items-center gap-2">
          <div className="h-4 w-1/4 rounded bg-gray-300"></div>
          <div className="h-4 w-1/4 rounded bg-gray-300"></div>
        </div>
        <div className="mb-4 h-40 w-full rounded bg-gray-300"></div>
        {/* <div className="mb-4 h-6 w-1/3 rounded bg-gray-300"></div>
        <div className="h-6 w-1/2 rounded bg-gray-300"></div> */}
      </div>
    </div>
  );
};

const ThreadComponent = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const pageNumber = searchParams.get("page")
    ? Number(searchParams.get("page"))
    : 1;

  const fetchThreadById = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/Thread/${params.id}?pageNumber=${pageNumber}&pageSize=10`
    );
    const data = await res.json();
    return {
      thread: data.data,
      totalPages: data.totalPages,
    };
  };

  const { data, error, isLoading } = useQuery({
    queryKey: ["thread", params.id, pageNumber],
    queryFn: fetchThreadById,
  });

  const userId = getUserIdFromToken();
  const { data: userInfo } = useFetchUser(userId || "");

  if (isLoading) {
    return (
      <div className="container">
        <SkeletonLoader />
      </div>
    );
  }

  if (error) {
    return <div>Error loading thread</div>;
  }

  if (!data) {
    return <div>No data available</div>;
  }

  const { thread, totalPages } = data || {};

  const paths = [
    { url: "/", label: "Forums" },
    { url: `/forum/${thread.forumId}`, label: thread.forumName },
  ];

  const currentPage = "Hỏi đáp";

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
          <div className="my-3 flex items-center gap-2">
            <span
              className={`mr-1 rounded-sm border p-1 text-sm font-medium dark:bg-transparent border-solid ${getTagClasses(
                thread.tag
              )}`}
            >
              {thread.tag}
            </span>
            <h1 className="text-2xl text-black">{thread.title}</h1>
          </div>
          <div className="flex items-center text-sm text-gray-400">
            <div className="flex items-center gap-1">
              <FiUser />
              <p>{thread.displayName}</p>
            </div>
            <BsDot />
            <div className="flex items-center gap-1">
              <IoMdTime />
              <p>{formatDate(thread.createdAt)}</p>
            </div>
          </div>
          <div className="my-4">
            {pageNumber === 1 && (
              <Card className="my-2 overflow-hidden rounded-none border-none">
                <CardContent className="grid gap-5 p-0 lg:flex lg:gap-0">
                  <div className="relative flex items-center gap-2 bg-stone-100 p-3 dark:bg-stone-900 lg:w-[150px] lg:flex-col">
                    <Image
                      src={thread.avatarUrl || avatar}
                      alt="avatar"
                      width={100}
                      height={100}
                      className="h-16 w-16 rounded-full lg:h-24 lg:w-24"
                    />
                    <div className="w-full break-words">
                      <p className="text-center">{thread.displayName}</p>
                      <Button className="mt-1 w-full rounded-sm border border-sky-400 bg-transparent shadow-none hover:bg-transparent">
                        <span>Chủ thớt</span>
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-3">
                    <div className="flex items-center justify-between border-b border-[#d3d5d7] pb-1 text-[13.5px] text-gray-400 dark:border-gray-600">
                      <p>{formatDate(thread.createdAt)}</p>
                    </div>
                    <div className="py-2">
                      <div
                        className="text-black dark:text-gray-400"
                        dangerouslySetInnerHTML={{ __html: thread.content }}
                      ></div>
                    </div>
                    {userInfo && (
                      <div className="mt-auto flex items-center justify-between">
                        <p>Report</p>
                        <div className="flex items-center gap-2">
                          <BsReply />
                          <p>Reply</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
            <div className="my-2 h-[0.1px] w-full bg-teal-100 dark:bg-[#44494c]"></div>
            <CommentThread thread={thread} />
            <PaginationPage totalPages={totalPages} pageNumber={pageNumber} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ThreadComponent;
