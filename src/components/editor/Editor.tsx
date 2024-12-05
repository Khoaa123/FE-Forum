"use client";
import React, {
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import EmojiAndSticker from "../emojiAndSticker/EmojiAndSticker";
import ImageResize from "quill-image-resize-module-react";
import { useCommentStore } from "@/store/Comment";
import { useQuery } from "@tanstack/react-query";

declare global {
  interface Window {
    Quill: any;
  }
}
window.Quill = Quill;
Quill.register("modules/imageResize", ImageResize);

var icons = Quill.import("ui/icons");
icons["emoji"] = `<svg 
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 24 24"
  fill="none"
  stroke="#000000"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <circle cx="12" cy="12" r="10" />
  <path d="M8 14s1.5 2 4 2 4-2 4-2" />
  <line x1="9" y1="9" x2="9.01" y2="9" />
  <line x1="15" y1="9" x2="15.01" y2="9" />
</svg>`;

type Editor = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

const Editor = ({
  value,
  onChange,
  placeholder = "Write something...",
}: Editor) => {
  // const [value, setValue] = useState("");
  const [isOpenEmoji, setIsOpenEmoji] = useState(false);
  const [isEmojiActive, setIsEmojiActive] = useState(false);
  const quillRef = useRef<ReactQuill>(null);

  const emojiHandler = () => {
    setIsOpenEmoji((prev) => !prev);
    setIsEmojiActive((prev) => !prev);
  };

  useEffect(() => {
    const emojiButton = document.querySelector(".ql-emoji");
    if (isEmojiActive) {
      emojiButton?.classList.add("active");
    } else {
      emojiButton?.classList.remove("active");
    }
  }, [isEmojiActive]);

  const modules = useMemo(
    () => ({
      imageResize: {
        parchment: Quill.import("parchment"),
        modules: ["Resize", "DisplaySize", "Toolbar"],
      },
      toolbar: {
        container: [
          ["bold", "italic", "underline"], // toggled buttons
          ["link", "image", "video"],
          ["emoji"],

          [{ header: 1 }, { header: 2 }], // custom button values
          [{ list: "ordered" }, { list: "bullet" }],

          [{ size: ["small", false, "large", "huge"] }], // custom dropdown
          [{ header: [1, 2, 3, false] }],

          [{ color: [] }, { background: [] }], // dropdown with defaults from theme
          [{ align: [] }],
        ],
        handlers: {
          emoji: emojiHandler,
        },
        clipboard: {
          matchVisual: false,
        },
      },
    }),
    []
  );

  const { idComment } = useCommentStore();

  const fetchCommentId = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/Comment/${idComment}`
    );
    const data = await res.json();
    return data.data;
  };

  const {
    data: commentReply,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["commentReply", idComment],
    queryFn: fetchCommentId,
    enabled: !!idComment,
  });

  return (
    <>
      <ReactQuill
        ref={quillRef}
        modules={modules}
        theme="snow"
        value={value}
        onChange={(content) => {
          onChange(content);
        }}
        placeholder={placeholder}
        className={`flex h-72 flex-1 flex-col text-black ${
          commentReply ? "add-padding-top" : ""
        }`}
      />
      {commentReply && (
        <div className="absolute left-0 right-0 mx-[15px] my-2 translate-y-12 border border-l-[3px] border-l-amber-500 bg-gray-100 dark:bg-[#232627]">
          <div className="bg-stone-50 dark:bg-[#1D1F20]">
            <p className="px-2 py-1 text-amber-400">
              {commentReply.userName} trả lời:
            </p>
          </div>
          <p className="px-2 py-1 text-black dark:text-gray-300">
            {commentReply.content}
          </p>
        </div>
      )}
      <div
        className={`transition-all ease-in-out text-wrap overflow-y-hidden delay-150 duration-300 ${
          isOpenEmoji ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        <EmojiAndSticker
          onSelect={(emojiUrl: string) => {
            if (quillRef.current) {
              const quill = quillRef.current.getEditor();
              const range = quill.getSelection(true);
              if (range) {
                const imgTag = `<img src="${emojiUrl}" alt="emoji">`;
                quill.clipboard.dangerouslyPasteHTML(range.index, imgTag);
                onChange(quill.root.innerHTML);
              }
            }
          }}
        />
      </div>
    </>
  );
};

export default Editor;
