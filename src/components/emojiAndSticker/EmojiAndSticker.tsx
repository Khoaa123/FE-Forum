import React, { useEffect, useState } from "react";
import useSWR from "swr";
import Image from "next/image";

const EmojiAndSticker = ({ onSelect, style, onClose }: any) => {
  const [isActive, setIsActive] = useState("Voz-Bựa");

  const fetcher = async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  };

  const { data: urls = [], error } = useSWR(
    `${
      process.env.NEXT_PUBLIC_API_BASE_URL
    }/EmojiAndSticker?name=${encodeURIComponent(isActive)}`,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  return (
    <>
      <div style={style} className="mt-5 h-40 overflow-hidden overflow-y-auto">
        <div className="flex flex-wrap justify-around gap-3" tabIndex={0}>
          <button
            className={`${
              isActive === "Voz-Bựa" &&
              "bg-gray-200 text-[#3a86ff] dark:bg-gray-800"
            } transition rounded-sm p-2`}
            onClick={() => setIsActive("Voz-Bựa")}
          >
            Voz Bựa
          </button>
          <button
            className={`${
              isActive === "Pepe" &&
              "bg-gray-200 dark:bg-gray-800 text-[#3a86ff]"
            } transition rounded-sm p-2`}
            onClick={() => setIsActive("Pepe")}
          >
            Ếch Xanh
          </button>
          <button
            className={`${
              isActive === "Pepe-Gif" &&
              "bg-gray-200 dark:bg-gray-800 text-[#3a86ff]"
            } transition rounded-sm p-2`}
            onClick={() => setIsActive("Pepe-Gif")}
          >
            Ếch Xanh Gif
          </button>
          <button
            className={`${
              isActive === "Mèo-mập" &&
              "bg-gray-200 dark:bg-gray-800 text-[#3a86ff]"
            } transition rounded-sm p-2`}
            onClick={() => setIsActive("Mèo-mập")}
          >
            Mèo mập bụng bự
          </button>
          <button
            className={`${
              isActive === "Qoobee" &&
              "bg-gray-200 dark:bg-gray-800 text-[#3a86ff]"
            } transition rounded-sm p-2`}
            onClick={() => setIsActive("Qoobee")}
          >
            Qoobee
          </button>
        </div>
        <div className="grid grid-cols-4 py-1 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
          {urls.map((url: string) => (
            <Image
              key={url}
              src={url}
              alt=""
              width={40}
              height={40}
              unoptimized={true}
              onClick={() => onSelect(url)}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default EmojiAndSticker;
