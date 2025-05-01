import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Image from "next/image";
import avatar from "@images/avatar.png";
import Link from "next/link";
import Forum from "../forum/Forum";
import { Thread } from "@/app/thread/[id]/page";
import { formatDate, formatDateLastActivity } from "@/utils/FormatDate";

type Category = {
  id: number;
  name: string;
};

const HomePage = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/Category`, {
    cache: "no-store",
  });

  const data = await res.json();
  const categories: Category[] = data.data;

  const threadRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/Thread/Latest`,
    {
      cache: "no-store",
    }
  );
  const threadData = await threadRes.json();
  const threads: Thread[] = threadData.data;

  const trendingThreadRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/Thread/Trending`,
    {
      cache: "no-store",
    }
  );
  const trendingThreadData = await trendingThreadRes.json();
  const trendingThreads: Thread[] = trendingThreadData.data;

  console.log("trendingThreads", trendingThreads);
  return (
    <>
      <div className="container mt-2">
        <div className="grid grid-cols-4 gap-3">
          <div className="col-span-3">
            {categories.map((category) => (
              <Card
                className="my-3 overflow-hidden rounded-sm border shadow-none"
                key={category.id}
              >
                <CardHeader className="border-b border-[#d3d5d7] bg-[#e8f4fc] px-4 py-2 outline-none dark:border-[#44494c] dark:bg-[#1D1F20]">
                  <CardTitle className="text-xl font-normal text-sky-600 dark:text-amber-50">
                    {category.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Forum categoryId={category.id} />
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="col-span-1">
            <Card className="my-3 overflow-hidden rounded-sm shadow-none">
              <CardHeader className="border-none px-4 py-3 outline-none">
                <CardTitle className="text-[16px] text-sky-600">
                  Mới nhất
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {threads.map((thread) => (
                  <div className="flex gap-2 px-4 py-1" key={thread.id}>
                    <div className="flex-shrink-0">
                      <Image
                        src={avatar}
                        alt="avatar"
                        width={30}
                        height={30}
                        className="mt-1 rounded-full"
                      />
                    </div>
                    <Link href={`/thread/${thread.id}`} className="text-sm">
                      <p className="line-clamp-2 cursor-pointer text-blue-500 hover:text-amber-500 hover:underline">
                        {thread.title}
                      </p>
                      <p className="text-gray-400">
                        {formatDateLastActivity(thread.createdAt)}
                      </p>
                    </Link>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="my-3 overflow-hidden rounded-sm shadow-none">
              <CardHeader className="border-none px-4 py-3 outline-none">
                <CardTitle className="text-[16px] text-sky-600">
                  Trending nhất
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {trendingThreads.map((thread) => (
                  <div className="flex gap-2 px-4 py-1">
                    <div className="flex-shrink-0">
                      <Image
                        src={avatar}
                        alt="avatar"
                        width={30}
                        height={30}
                        className="mt-1 rounded-full"
                      />
                    </div>
                    <Link href={`/thread/${thread.id}`} className="text-sm">
                      {" "}
                      <p className="line-clamp-2 cursor-pointer text-blue-500 hover:text-amber-500 hover:underline">
                        {thread.title}
                      </p>
                      <p className="text-gray-400">
                        {formatDate(thread.createdAt)}
                      </p>
                      <p className="text-gray-400">
                        Lượt xem:{" "}
                        <span className="text-blue-500">
                          {thread.viewCount}
                        </span>
                      </p>
                    </Link>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        <div></div>
      </div>
    </>
  );
};

export default HomePage;
