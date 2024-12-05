"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Editor from "../editor/Editor";
import { toast } from "react-toastify";
import { useUserStore } from "@/store/User";
import { useCookies } from "next-client-cookies";

const EditorPostThread = ({ forumId }: { forumId: number }) => {
  const [title, setTitle] = useState<string>("");
  const [tag, setTag] = useState("");
  const [content, setContent] = useState<string>("");
  const [isSticky, setIsSticky] = useState(false);
  const { setDisplayName, userId } = useUserStore();
  const cookies = useCookies();

  useEffect(() => {
    const token = cookies.get("accessToken");
    if (token) {
      setDisplayName(token);
    }
  }, [cookies, setDisplayName]);

  const handleCreate = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/Thread/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Title: title,
        Content: content,
        Tag: tag,
        IsSticky: false,
        UserId: userId,
        ForumId: forumId,
      }),
    });

    const data = await res.json();
    if (res.status === 201) {
      toast.success("Tạo thread thành công");
    } else {
      toast.error(data.message || "Đã xảy ra lỗi");
    }
  };

  return (
    <>
      <div>
        <Card className="my-3 overflow-hidden rounded-none border-none bg-white">
          <CardHeader className="m-3 flex-row space-y-0 overflow-hidden rounded-sm border border-solid border-gray-400 p-0 focus-within:border-sky-400">
            <Select value={tag} onValueChange={(value) => setTag(value)}>
              <SelectTrigger className="w-[120px] rounded-none bg-[#e5eaf0] shadow-none focus:right-0 focus-visible:ring-0">
                <SelectValue placeholder="Tag" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem
                    value="Thắc mắc"
                    className="my-2 cursor-pointer bg-[#dce7f5]"
                  >
                    Thắc mắc
                  </SelectItem>
                  <SelectItem
                    value="Thảo luận"
                    className="my-2 cursor-pointer bg-yellow-500"
                  >
                    Thảo luận
                  </SelectItem>
                  <SelectItem
                    value="Kiến thức"
                    className="my-2 cursor-pointer bg-blue-500"
                  >
                    Kiến thức
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <div className="flex-1 bg-transparent text-xl">
              <input
                type="text"
                name=""
                id=""
                placeholder="Nhập title"
                className="h-full w-full bg-transparent px-2 outline-none"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          </CardHeader>
          <div className="m-3">
            <Editor
              value={content}
              onChange={setContent}
              placeholder="Hãy nhập nội dung..."
            />
          </div>
          <div className="my-2 text-center">
            <Button className="bg-[#5c7099] text-white" onClick={handleCreate}>
              Đăng thread
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
};

export default EditorPostThread;
