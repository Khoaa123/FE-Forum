"use client";
import { Dialog, DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import React, { useState } from "react";
import { DialogContent, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Image from "next/image";
import avatar from "@images/avatardefault.png";
import { BsDot } from "react-icons/bs";
import { ScrollArea } from "../ui/scroll-area";
import { formatDate } from "@/utils/FormatDate";

type Reaction = {
  id: number;
  type: number;
  userName: string;
  avatarUrl: string;
  createdAt: string;
};

type ReactCommentProps = {
  reactions: Reaction[];
};
const ReactComment = ({ reactions }: ReactCommentProps) => {
  const [isActive, setIsActive] = useState("All");

  const sliceReaction = reactions.slice(0, 1);
  const moreReactionsCount = reactions.length - 1;

  const uniqueReactionImage = new Set();

  const reactionCount = reactions.reduce(
    (count, reaction) => {
      if (reaction.type === 0) count.like += 1;
      if (reaction.type === 1) count.dislike += 1;
      return count;
    },
    { like: 0, dislike: 0 }
  );

  const filteredReactions =
    isActive === "All"
      ? reactions
      : reactions.filter(
          (reaction) =>
            (isActive === "Ưng" && reaction.type === 0) ||
            (isActive === "Gạch" && reaction.type === 1)
        );

  return (
    <>
      <Dialog>
        <DialogTrigger className="mt-auto flex w-full">
          <div className="mt-5 flex w-full border-l-2 border-l-blue-600 bg-gray-100 dark:bg-stone-900">
            <div className="flex gap-1 px-3 py-1">
              {reactions.map((reaction, index) => {
                const imageUrl =
                  reaction.type === 0
                    ? "https://res.cloudinary.com/dija8tzko/image/upload/v1721388819/Voz-Emoji-Sticker/eoqxt94zdqasrhpr3yiq.png"
                    : reaction.type === 1
                    ? "https://res.cloudinary.com/dija8tzko/image/upload/v1721388845/Voz-Emoji-Sticker/hl08gfxkwoy1u567utzt.png"
                    : "";

                if (!uniqueReactionImage.has(reaction.type) && imageUrl) {
                  uniqueReactionImage.add(reaction.type);
                  return (
                    <Image
                      key={index}
                      src={imageUrl}
                      alt="reaction"
                      width={20}
                      height={20}
                    />
                  );
                }
                return null;
              })}
            </div>
            <p className="cursor-pointer py-1 text-start hover:text-amber-400">
              {sliceReaction.map((reaction, index) => (
                <span key={index}>{reaction.userName} </span>
              ))}
              {moreReactionsCount > 0 && (
                <span>và {moreReactionsCount} người khác</span>
              )}
            </p>
          </div>
        </DialogTrigger>
        <DialogContent className="block overflow-hidden border-none bg-[#ebeced] p-0 sm:max-w-[800px]">
          <div className="bg-reaction-comment dark:bg-reaction-comment p-3 text-xl text-[#ebeced] dark:text-amber-50">
            Reaction
          </div>
          <div className="flex items-center gap-3 border-b border-[#b5b9bd] dark:border-[#44494c] dark:bg-[#232627]">
            <button
              className={`${
                isActive === "All" &&
                "border-b-2 border-cyan-700 dark:border-cyan-400"
              } transition`}
              onClick={() => setIsActive("All")}
            >
              <p className="px-3 py-2 text-cyan-600 dark:text-cyan-400">
                All <span>{reactions.length}</span>
              </p>
            </button>
            <button
              className={`${
                isActive === "Ưng" &&
                "border-b-2 border-blue-800 dark:border-blue-400"
              } transition`}
              onClick={() => setIsActive("Ưng")}
            >
              <p className="px-3 py-2 text-blue-800 dark:text-blue-400">
                Ưng{" "}
                <span>({reactions.filter((r) => r.type === 0).length})</span>
              </p>
            </button>
            <button
              className={`${
                isActive === "Gạch" &&
                "border-b-2 border-red-500 dark:border-red-600"
              } transition`}
              onClick={() => setIsActive("Gạch")}
            >
              <p className="px-3 py-2 text-red-500 dark:text-red-600">
                Gạch
                <span>({reactions.filter((r) => r.type === 1).length})</span>
              </p>
            </button>
          </div>
          <ScrollArea className="h-96 dark:bg-[#232627]">
            {filteredReactions.map((reaction, index) => (
              <div
                className="border-b border-[#b5b9bd] dark:border-[#44494c]"
                key={index}
              >
                <div className="flex items-center gap-3 p-3">
                  <Image
                    src={reaction.avatarUrl || avatar}
                    alt=""
                    width={100}
                    height={100}
                    className="h-16 w-16 rounded-full lg:h-12 lg:w-12"
                  />

                  <div>
                    <p className="font-semibold text-sky-800 dark:text-sky-300">
                      {reaction.userName}
                    </p>
                    <p className="dark:text-amber-50">Bạc đoàn</p>
                    <div className="flex items-center gap-1">
                      <span className="text-gray-400">Message: 12</span>
                      <BsDot className="text-gray-400" />
                      <span className="text-gray-400">Reaction: 7</span>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col items-end gap-1">
                    {reaction.type === 0 ? (
                      <Image
                        src="https://res.cloudinary.com/dija8tzko/image/upload/v1721388819/Voz-Emoji-Sticker/eoqxt94zdqasrhpr3yiq.png"
                        alt=""
                        width={100}
                        height={100}
                        className="h-16 w-16 rounded-full lg:h-10 lg:w-10"
                      />
                    ) : (
                      <Image
                        src="https://res.cloudinary.com/dija8tzko/image/upload/v1721388845/Voz-Emoji-Sticker/hl08gfxkwoy1u567utzt.png"
                        alt=""
                        width={100}
                        height={100}
                        className="h-16 w-16 rounded-full lg:h-10 lg:w-10"
                      />
                    )}
                    <p className="text-xs dark:text-gray-300">
                      {formatDate(reaction.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ReactComment;
