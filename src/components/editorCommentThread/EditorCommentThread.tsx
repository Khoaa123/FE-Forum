"use client";
import React, { useEffect, useState } from "react";
import Editor from "../editor/Editor";
import { Button } from "../ui/button";
import { useCookies } from "next-client-cookies";
import { useUserStore } from "@/store/User";
import { toast } from "react-toastify";

const EditorCommentThread = ({
  threadId,
  onCommentAdded,
}: {
  threadId: number;
  onCommentAdded: (newComment: any) => void;
}) => {
  const [content, setContent] = useState<string>("");

  const { setDisplayName, userId } = useUserStore();
  const cookies = useCookies();

  useEffect(() => {
    const token = cookies.get("accessToken");
    if (token) {
      setDisplayName(token);
    }
  }, [cookies, setDisplayName]);

  const handleCreate = async () => {
    if (content.trim() === "") {
      toast.error("Nội dung không thể để trống");
      return;
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/Comment/Comment`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Content: content,
          ThreadId: threadId,
          UserId: userId,
          ParentCommentId: null,
        }),
      }
    );

    const data = await res.json();
    if (res.status === 201) {
      toast.success("Đăng comment thành công");
      setContent("");
      const newComment = await data.data;
      onCommentAdded(newComment);
      console.log(data.message || "Error occurred");
    }
  };

  return (
    <>
      <div className="editor relative flex flex-1 flex-col bg-[#e5eaf0] bg-opacity-40 dark:bg-transparent">
        <Editor
          value={content}
          onChange={setContent}
          placeholder="Hãy nhập bình luận..."
        />
      </div>
      <div className="flex justify-center">
        <Button
          onClick={handleCreate}
          className="mt-2 bg-[#5c7099] text-white hover:bg-[#4d5d80]"
        >
          Đăng comment
        </Button>
      </div>
    </>
  );
};

export default EditorCommentThread;
