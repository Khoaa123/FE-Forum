"use client";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { BsDot } from "react-icons/bs";
import { formatDate } from "@/utils/FormatDate";
import Image from "next/image";
import avatar from "@images/avatar.png";
import PaginationPage from "@/components/pagination/Pagination";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const SearchResult = () => {
  const searchParams = useSearchParams();

  const keyword = searchParams.get("keyword") || "";
  const forum = searchParams.get("forum") || "";
  const tag = searchParams.get("tag") || "";
  const pageNumber = Number(searchParams.get("page")) || 1;
  const pageSize = 8;
  const fetchSearchResults = async (): Promise<any> => {
    const queryParams = new URLSearchParams({
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString(),
      ...(keyword && { keyword }),
      ...(forum && { forum }),
      ...(tag && { tag }),
    });

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/Search/search?${queryParams}`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch search results");
    }

    const data = await res.json();
    return {
      threads: data.data,
      totalPages: data.totalPages,
    };
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["search", keyword, forum, tag, pageNumber],
    queryFn: fetchSearchResults,
    enabled: !!(keyword || forum || tag),
  });

  const threads = data?.threads || [];
  const totalPages = data?.totalPages || 0;

  const baseParams = `keyword=${keyword}&forum=${forum}&tag=${tag}`;

  return (
    <div className="container my-5">
      <h1 className="mb-4 text-2xl font-bold text-gray-600">
        Kết quả tìm kiếm: <span className="text-sky-700">{keyword}</span>
      </h1>

      {isLoading && (
        <div>
          <Skeleton
            height={100}
            baseColor="#f0f0f0"
            highlightColor="#fafafa"
            className="mb-4"
          />
          <Skeleton
            height={100}
            baseColor="#f0f0f0"
            highlightColor="#fafafa"
            className="mb-4"
          />
        </div>
      )}

      {error && <p className="text-red-500">Lỗi: {error.message}</p>}

      {!isLoading && threads.length > 0 && (
        <Card className="mt-3 rounded-none border-none bg-[#EBECED] dark:bg-[#1d1f20]">
          <CardContent className="p-0">
            {threads.map((thread: any) => (
              <Link
                href={`/thread/${thread.id}`}
                key={thread.id}
                className="flex cursor-pointer gap-2 border-b border-[#b5b9bd] px-4 py-2 dark:border-[#3e4346]"
              >
                <div className="flex gap-3">
                  <div className="flex items-start">
                    <Image
                      src={thread.avatarUrl || avatar}
                      alt="avatar"
                      width={45}
                      height={45}
                      className="rounded-full"
                    />
                  </div>
                  <div>
                    <div className="line-clamp-1 py-[2px] text-[16px]">
                      <span className="mr-2 rounded-sm border border-solid border-sky-500 bg-[#dce7f5] p-[3px] text-xs font-medium dark:bg-transparent">
                        {thread.tag}
                      </span>
                      {thread.title}
                    </div>
                    <div className="my-1">
                      <div
                        className="line-clamp-1 text-black dark:text-gray-300"
                        dangerouslySetInnerHTML={{
                          __html: thread.content,
                        }}
                      ></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center text-gray-400">
                        <Link
                          href={`/profile/${thread.userId}`}
                          className="hover:underline"
                        >
                          {thread.userName}
                        </Link>
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

      {!isLoading && totalPages > 1 && (
        <PaginationPage
          totalPages={totalPages}
          pageNumber={pageNumber}
          baseParams={baseParams}
        />
      )}
    </div>
  );
};

export default SearchResult;
