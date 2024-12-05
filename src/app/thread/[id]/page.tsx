import BreadcrumbDetail from "@/components/breadcrumb/Breadcrumb";
import PaginationPage from "@/components/pagination/Pagination";
import React from "react";
import { FiUser } from "react-icons/fi";
import { IoMdTime } from "react-icons/io";
import { BsDot, BsReply } from "react-icons/bs";
import { Card, CardContent } from "@/components/ui/card";
import avatar from "@images/avatar.png";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { formatDate } from "@/utils/FormatDate";
import { Button } from "@/components/ui/button";
import CommentThread from "@/components/commentThread/CommentThread";
import ThreadComponent from "@/components/threadComponent/ThreadComponent";

export type Thread = {
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
  comments: Comment[];
  lastCommentAt: string;
  lastCommentBy: string;
};

export type Comment = {
  id: number;
  content: string;
  createdAt: string;
  threadName: string;
  userName: string;
  avatarUrl: string;
  replies: any[];
  reactions: Reaction[];
  parentCommentId: number;
};

export type Reaction = {
  id: number;
  type: number;
  userName: string;
  avatarUrl: string;
  userId: string;
  createdAt: string;
};

const ReactComment = dynamic(
  () => import("@/components/reactionComment/ReactComment"),
  {
    ssr: true,
  }
);

const Editor = dynamic(() => import("@/components/editor/Editor"), {
  ssr: false,
});

// const ThreadComponent = dynamic(
//   () => import("@/components/threadComponent/ThreadComponent"),
//   { ssr: false }
// );
// const pageNumber = 1;
const Thread = async () => {
  // const res = await fetch(
  //   `${process.env.NEXT_PUBLIC_API_BASE_URL}/Thread/${params.id}?pageNumber=${pageNumber}&pageSize=1`,
  //   {
  //     cache: "no-store",
  //   }
  // );

  // const data = await res.json();
  // const thread: Thread = data.data;

  // const paths = [
  //   { url: "/", label: "Forums" },
  //   { url: `/forum/${thread.forumId}`, label: thread.forumName },
  // ];
  // const currentPage = "Hỏi đáp";
  // const totalPages = data.totalPages;
  // console.log(searchParams.page);
  return (
    <>
      <ThreadComponent />
    </>
  );
};

export default Thread;
