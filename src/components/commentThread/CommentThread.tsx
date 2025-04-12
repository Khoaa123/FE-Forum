"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { formatDate } from "@/utils/FormatDate";
import ReactComment from "../reactionComment/ReactComment";
import avatar from "@images/avatardefault.png";
import { BsReply, BsEmojiKiss, BsEmojiAngry } from "react-icons/bs";
import dynamic from "next/dynamic";
import { useUserStore } from "@/store/User";
import { toast } from "react-toastify";
import { Comment, Reaction, Thread } from "@/app/thread/[id]/page";
import { useCommentStore } from "@/store/Comment";
import useFetchUser from "@/hooks/useFetchUser";
import { getUserIdFromToken } from "@/utils/Helpers";

type ThreadProp = {
  thread: Thread;
};

const EditorCommentThread = dynamic(
  () => import("../editorCommentThread/EditorCommentThread"),
  { ssr: false }
);

const CommentThread = ({ thread }: ThreadProp) => {
  const [comments, setComments] = useState<Comment[]>(thread.comments);
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [parentCommentsCache, setParentCommentsCache] = useState<
    Record<number, Comment>
  >({});
  const [loadingParents, setLoadingParents] = useState<boolean>(false);

  const userId = getUserIdFromToken();

  const addNewComment = (newComment: Comment) => {
    setComments((prevComments) => [...prevComments, newComment]);
    setReplyTo(null);
  };

  const handleReaction = async (commentId: number, type: number) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/Comment/Reaction`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            Type: type,
            UserId: userId,
            CommentId: commentId,
          }),
        }
      );
      const data = await res.json();
      toast.success(data.message);
    } catch (error) {
      console.error("Error adding reaction:", error);
    }
  };

  const { setIdComment, idComment } = useCommentStore();

  useEffect(() => {
    if (idComment) {
      setReplyTo(idComment);
    }
  }, [idComment]);

  const { data: userInfo, isLoading, isError } = useFetchUser(userId || "");

  // Hàm fetch thông tin comment cha từ API
  const fetchParentComment = useCallback(
    async (parentId: number) => {
      if (parentCommentsCache[parentId]) {
        return parentCommentsCache[parentId];
      }

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/Comment/${parentId}`
        );
        if (!res.ok) throw new Error("Failed to fetch parent comment");
        const data = await res.json();
        const parentComment: Comment = data.data; // Đảm bảo khớp với type Comment
        setParentCommentsCache((prev) => ({
          ...prev,
          [parentId]: parentComment,
        }));
        return parentComment;
      } catch (error) {
        console.error(`Error fetching parent comment ${parentId}:`, error);
        return null;
      }
    },
    [parentCommentsCache]
  );

  // Fetch tất cả các comment cha khi danh sách comments thay đổi
  useEffect(() => {
    const fetchAllParentComments = async () => {
      setLoadingParents(true);
      const parentIds = comments
        .filter(
          (comment) =>
            comment.parentCommentId !== undefined &&
            comment.parentCommentId !== null
        )
        .map((comment) => comment.parentCommentId!)
        .filter(
          (id) =>
            !thread.comments.some((c) => c.id === id) &&
            !comments.some((c) => c.id === id) &&
            !parentCommentsCache[id]
        );

      const uniqueParentIds = parentIds.filter(
        (id, index) => parentIds.indexOf(id) === index
      );

      if (uniqueParentIds.length > 0) {
        const fetchPromises = uniqueParentIds.map((parentId) =>
          fetchParentComment(parentId)
        );
        await Promise.all(fetchPromises);
      }
      setLoadingParents(false);
    };

    fetchAllParentComments();
  }, [comments, thread.comments, fetchParentComment]);

  // Hàm tìm comment cha
  const findParentComment = useCallback(
    (parentId: number) => {
      return (
        thread.comments.find((comment: Comment) => comment.id === parentId) ||
        comments.find((comment: Comment) => comment.id === parentId) ||
        parentCommentsCache[parentId] ||
        null
      );
    },
    [thread.comments, comments, parentCommentsCache]
  );

  return (
    <>
      <div>
        {comments.map((comment, index) => {
          const userReaction = comment.reactions.find(
            (reaction) => reaction.userId === userId
          );
          const parentComment = comment.parentCommentId
            ? findParentComment(comment.parentCommentId)
            : null;

          return (
            <Card
              className="my-2 overflow-hidden rounded-none border-none"
              key={index}
            >
              <CardContent className="grid gap-5 p-0 lg:flex lg:gap-0">
                <div className="relative flex items-center gap-2 bg-stone-100 p-3 dark:bg-stone-900 lg:w-[150px] lg:flex-col">
                  <Image
                    src={comment.avatarUrl || avatar}
                    alt="avatar"
                    width={100}
                    height={100}
                    className="h-16 w-16 rounded-full lg:h-24 lg:w-24"
                  />
                  <div className="w-full break-words">
                    <p className="text-center">{comment.userName}</p>
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-3">
                  <div className="flex items-center justify-between border-b border-[#d3d5d7] pb-1 text-[13.5px] text-gray-400 dark:border-gray-600">
                    <p>{formatDate(comment.createdAt)}</p>
                  </div>
                  <div className="py-2">
                    {comment.parentCommentId !== undefined && (
                      <div className="my-2 border border-l-[3px] border-l-amber-500 bg-gray-100 dark:bg-[#232627]">
                        {loadingParents ? (
                          <p className="px-2 py-1 text-gray-500">Đang tải...</p>
                        ) : parentComment ? (
                          <>
                            <div className="bg-stone-50 dark:bg-[#1D1F20]">
                              <p className="px-2 py-1 text-amber-400">
                                {parentComment.userName} trả lời:
                              </p>
                            </div>
                            <p className="px-2 py-1 text-black dark:text-gray-300">
                              {parentComment.content}
                            </p>
                          </>
                        ) : (
                          <p className="px-2 py-1 text-gray-500">
                            Không tìm thấy comment cha
                          </p>
                        )}
                      </div>
                    )}
                    <div
                      className="text-black dark:text-gray-300"
                      dangerouslySetInnerHTML={{ __html: comment.content }}
                    ></div>
                  </div>
                  {userInfo && comment.userId !== userId && (
                    <div className="mt-auto flex items-center justify-between">
                      <p className="cursor-pointer">Report</p>
                      <div className="flex gap-5">
                        <div
                          className={`flex cursor-pointer items-center gap-2 ${
                            userReaction?.type === 0 ? "text-red-500" : ""
                          }`}
                          onClick={() => handleReaction(comment.id, 0)}
                        >
                          <BsEmojiKiss />
                          <p>Ưng</p>
                        </div>
                        <div
                          className={`flex cursor-pointer items-center gap-2 font-bold ${
                            userReaction?.type === 1 ? "text-red-500" : ""
                          }`}
                          onClick={() => handleReaction(comment.id, 1)}
                        >
                          <BsEmojiAngry />
                          <p className="">Gạch</p>
                        </div>
                        <div
                          className="flex cursor-pointer items-center gap-2"
                          onClick={() => setIdComment(comment.id)}
                        >
                          <BsReply />
                          <p>Reply</p>
                        </div>
                      </div>
                    </div>
                  )}
                  {comment.reactions.length > 0 && (
                    <ReactComment reactions={comment.reactions} />
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
        {userInfo && (
          <Card className="my-2 overflow-hidden rounded-none border-none">
            <CardContent className="flex p-0">
              <div className="hidden w-[150px] flex-shrink-0 flex-col items-center bg-stone-100 p-3 dark:bg-stone-900 lg:flex">
                <Image
                  src={userInfo.avatarUrl || avatar}
                  alt="avatar"
                  width={100}
                  height={100}
                  className="rounded-full"
                />
              </div>
              <div className="flex h-full w-full flex-1 flex-col overflow-hidden p-3">
                <EditorCommentThread
                  threadId={thread.id}
                  onCommentAdded={addNewComment}
                  parentCommentId={replyTo}
                />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
};

export default CommentThread;
