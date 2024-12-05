import React from "react";

import {
  LuBold,
  LuStrikethrough,
  LuItalic,
  LuList,
  LuListOrdered,
  LuHeading1,
  LuHeading2,
  LuHeading3,
  LuUnderline,
  LuQuote,
  LuUndo,
  LuRedo,
  LuCode,
} from "react-icons/lu";
import { Editor } from "@tiptap/react";

type Props = {
  editor: Editor | null;
  content: string;
};
const Toolbar = ({ editor, content }: Props) => {
  if (!editor) {
    return null;
  }
  return (
    <>
      <div className="flex w-full flex-wrap items-start justify-between gap-5 rounded-tl-md rounded-tr-md border border-gray-700 px-4 py-3">
        <div className="flex w-full flex-wrap items-center justify-start gap-5 lg:w-10/12">
          <button
            onClick={(e) => {
              e.preventDefault();
              editor.chain().focus().toggleBold().run();
            }}
            className={
              editor.isActive("bold")
                ? "bg-sky-700 text-white p-2 rounded-lg"
                : "text-sky-400"
            }
          >
            <LuBold className="h-5 w-5" />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              editor.chain().focus().toggleItalic().run();
            }}
            className={
              editor.isActive("italic")
                ? "bg-sky-700 text-white p-2 rounded-lg"
                : "text-sky-400"
            }
          >
            <LuItalic className="h-5 w-5" />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              editor.chain().focus().toggleUnderline().run();
            }}
            className={
              editor.isActive("underline")
                ? "bg-sky-700 text-white p-2 rounded-lg"
                : "text-sky-400"
            }
          >
            <LuUnderline className="h-5 w-5" />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              editor.chain().focus().toggleStrike().run();
            }}
            className={
              editor.isActive("strike")
                ? "bg-sky-700 text-white p-2 rounded-lg"
                : "text-sky-400"
            }
          >
            <LuStrikethrough className="h-5 w-5" />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              editor.chain().focus().toggleHeading({ level: 1 }).run();
            }}
            className={
              editor.isActive("heading", { level: 1 })
                ? "bg-sky-700 text-white p-2 rounded-lg"
                : "text-sky-400"
            }
          >
            <LuHeading1 className="h-5 w-5" />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              editor.chain().focus().toggleHeading({ level: 2 }).run();
            }}
            className={
              editor.isActive("heading", { level: 2 })
                ? "bg-sky-700 text-white p-2 rounded-lg"
                : "text-sky-400"
            }
          >
            <LuHeading2 className="h-5 w-5" />
          </button>

          <button
            onClick={(e) => {
              e.preventDefault();
              editor.chain().focus().toggleBulletList().run();
            }}
            className={
              editor.isActive("bulletList")
                ? "bg-sky-700 text-white p-2 rounded-lg"
                : "text-sky-400"
            }
          >
            <LuList className="h-5 w-5" />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              editor.chain().focus().toggleOrderedList().run();
            }}
            className={
              editor.isActive("orderedList")
                ? "bg-sky-700 text-white p-2 rounded-lg"
                : "text-sky-400"
            }
          >
            <LuListOrdered className="h-5 w-5" />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              editor.chain().focus().toggleBlockquote().run();
            }}
            className={
              editor.isActive("blockquote")
                ? "bg-sky-700 text-white p-2 rounded-lg"
                : "text-sky-400"
            }
          >
            <LuQuote className="h-5 w-5" />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              editor.chain().focus().setCode().run();
            }}
            className={
              editor.isActive("code")
                ? "bg-sky-700 text-white p-2 rounded-lg"
                : "text-sky-400"
            }
          >
            <LuCode className="h-5 w-5" />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              editor.chain().focus().undo().run();
            }}
            className={
              editor.isActive("undo")
                ? "bg-sky-700 text-white p-2 rounded-lg"
                : "text-sky-400 hover:bg-sky-700 hover:text-white p-1 hover:rounded-lg"
            }
          >
            <LuUndo className="h-5 w-5" />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              editor.chain().focus().redo().run();
            }}
            className={
              editor.isActive("redo")
                ? "bg-sky-700 text-white p-2 rounded-lg"
                : "text-sky-400 hover:bg-sky-700 hover:text-white p-1 hover:rounded-lg"
            }
          >
            <LuRedo className="h-5 w-5" />
          </button>
        </div>
        {content && (
          <button
            type="submit"
            className="rounded-md bg-sky-700 px-4 py-2 text-white"
          >
            Add
          </button>
        )}
      </div>
    </>
  );
};

export default Toolbar;
