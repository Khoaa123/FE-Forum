import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaRegComments } from "react-icons/fa6";
import avatar from "@images/avatar.png";
import { formatDate } from "@/utils/FormatDate";

type LatestThread = {
  id: number;
  title: string;
  displayName: string;
  userId: string;
  createdAt: string;
  avatarUrl: string | null;
};

type Forum = {
  id: number;
  name: string;
  categoryName: string;
  threadCount: number;
  latestThread: LatestThread;
  totalComments: number;
};

const Forum = async ({ categoryId }: { categoryId: number }) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/Forum/${categoryId}`,
    {
      cache: "no-store",
    }
  );

  const data = await res.json();
  const forums: Forum[] = data.data;

  return (
    <>
      {forums.map((forum) => (
        <div key={forum.id}>
          <Link
            href={`/forum/${forum.id}`}
            className="grid cursor-pointer grid-cols-6 gap-2 border-b border-[#d3d5d7] px-4 py-2 dark:border-[#44494c]"
          >
            <div className="col-span-3 flex items-center gap-3">
              <FaRegComments size={30} color="#B1C1DA" />
              <p className="text-lg font-bold text-sky-600 hover:text-amber-500 hover:underline">
                {forum.name}
              </p>
            </div>
            <div className="col-span-1 flex gap-4">
              <div className="flex flex-col items-center">
                <p className="text-sm text-gray-400">Threads</p>
                <span className="dark:text-amber-50">{forum.threadCount}</span>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-sm text-gray-400">Messages</p>
                <span className="dark:text-amber-50">
                  {forum.totalComments}
                </span>
              </div>
            </div>
            <div className="col-span-2 flex gap-3">
              {forum.latestThread ? (
                <>
                  <div className="flex items-center">
                    <Image
                      src={forum.latestThread.avatarUrl || avatar}
                      alt="avatar"
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full"
                    />
                  </div>
                  <div>
                    <div className="line-clamp-1 py-[2px] text-sm">
                      <span className="mr-1 rounded-sm border border-solid border-sky-500 bg-[#dce7f5] p-[3px] text-xs font-medium dark:bg-transparent">
                        Thảo luận
                      </span>
                      {forum.latestThread.title}
                    </div>
                    <p className="text-sm text-gray-400">
                      {formatDate(forum.latestThread.createdAt)}
                    </p>
                  </div>
                </>
              ) : (
                <p></p>
              )}
            </div>
          </Link>
        </div>
      ))}
    </>
  );
};

export default Forum;
