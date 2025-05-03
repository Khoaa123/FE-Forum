"use client";
import BreadcrumbDetail from "@/components/breadcrumb/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { IoSearch } from "react-icons/io5";
import { useRouter } from "next/navigation";

type Thread = {
  id: number;
  title: string;
  tag: string;
  content: string;
  userName: string;
  forumName: string;
};

type SearchResponse = {
  data: Thread[];
  totalPages: number;
  totalItems: number;
};

const Search = () => {
  const [isActive, setIsActive] = useState("All");
  const [keyword, setKeyword] = useState("");
  const [forum, setForum] = useState("");
  const [tag, setTag] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams();
    if (keyword) params.append("keyword", keyword);
    if (forum) params.append("forum", forum);
    if (tag) params.append("tag", tag);

    router.push(`/search/result?${params.toString()}`);
  };

  return (
    <>
      <div className="container">
        <div className="my-3">
          {/* <BreadcrumbDetail /> */}
          <div className="my-3">
            <p className="text-2xl text-sky-600">Tìm kiếm</p>
          </div>
          <div>
            <Card className="my-3 overflow-hidden rounded-none border-none">
              <CardHeader className="flex-row space-y-0 bg-[#23497C] p-0 outline-none dark:bg-[#1d1f20]">
                <button
                  className={`${
                    isActive === "All" &&
                    "border-b-[3px] border-sky-300 bg-[#e8f4fc1a] !text-white"
                  }  px-3 py-2 text-[18px] text-[#869bbf] transition hover:bg-[#e8f4fc1a] hover:text-white`}
                  onClick={() => setIsActive("All")}
                >
                  Search tất cả
                </button>
                <button
                  className={`${
                    isActive === "Threads" &&
                    "border-b-[3px] border-sky-300 bg-[#e8f4fc1a] !text-white"
                  }  px-3 py-2 text-[18px] text-[#869bbf] transition hover:bg-[#e8f4fc1a] hover:text-white`}
                  onClick={() => setIsActive("Threads")}
                >
                  Search Threads
                </button>
              </CardHeader>
              <CardContent className="p-0">
                <form onSubmit={handleSearch}>
                  <div className="grid lg:grid-cols-3">
                    <div className="col-span-1 border-r border-[#cbcdd0] bg-[#E2E3E5] px-3 py-7 text-right text-black">
                      Từ khóa:
                    </div>
                    <div className="col-span-2 bg-[#EBECED] px-3 py-5">
                      <input
                        type="text"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        className="w-full rounded-md border border-solid border-[#b5b9bd] bg-[#e5eaf0] p-2 focus:border-sky-500 focus-visible:outline-none"
                      />
                    </div>
                  </div>
                  <div className="grid lg:grid-cols-3">
                    <div className="col-span-1 border-r border-[#cbcdd0] bg-[#E2E3E5] px-3 py-7 text-right text-black">
                      Forum:
                    </div>
                    <div className="col-span-2 bg-[#EBECED] px-3 py-5">
                      <input
                        type="text"
                        value={forum}
                        onChange={(e) => setForum(e.target.value)}
                        className="w-full rounded-md border border-solid border-[#b5b9bd] bg-[#e5eaf0] p-2 focus:border-sky-500 focus-visible:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid lg:grid-cols-3">
                    <div className="col-span-1 border-r border-[#cbcdd0] bg-[#E2E3E5] px-3 py-7 text-right text-black">
                      Tag:
                    </div>
                    <div className="col-span-2 bg-[#EBECED] px-3 py-5">
                      <input
                        type="text"
                        value={tag}
                        onChange={(e) => setTag(e.target.value)}
                        className="w-full rounded-md border border-solid border-[#b5b9bd] bg-[#e5eaf0] p-2 focus:border-sky-500 focus-visible:outline-none"
                      />
                    </div>
                  </div>
                  <div className="grid lg:grid-cols-3">
                    <div className="col-span-1 border-r border-[#cbcdd0] bg-[#E2E3E5] px-3 py-7 text-right text-black"></div>
                    <div className="col-span-2 bg-[#EBECED] px-3 py-5">
                      <Button className="gap-2 bg-[#5c7099] text-white hover:bg-[#4d5d80]">
                        <IoSearch color="white" size={20} />
                        Search
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default Search;
