import BreadcrumbDetail from "@/components/breadcrumb/Breadcrumb";

import dynamic from "next/dynamic";
import React from "react";

const EditorPostThread = dynamic(
  () => import("@/components/postThread/PostThread"),
  {
    ssr: false,
  }
);

const PostThread = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) => {
  const paths = [
    { url: "/", label: "Forums" },
    { url: `/forum/${searchParams.Id}`, label: searchParams.Forum },
  ];

  const currentPage = "Tạo thread";
  const forumId = parseInt(searchParams.Id);

  return (
    <>
      <div className="container">
        <div className="my-3">
          <BreadcrumbDetail paths={paths} currentPage={currentPage} />
          <div className="flex justify-between">
            <h1 className="mt-2 text-2xl font-medium text-black">Tạo Thread</h1>
          </div>
          <EditorPostThread forumId={forumId} />
        </div>
      </div>
    </>
  );
};

export default PostThread;
