import React from "react";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

type BreadCrumbProps = {
  paths: { url: string; label: string | undefined }[];
  currentPage: string;
};

const BreadcrumbDetail = ({ paths, currentPage }: BreadCrumbProps) => {
  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          {paths.map((path, index) => (
            <React.Fragment key={index}>
              <BreadcrumbItem>
                <BreadcrumbLink
                  href={path.url}
                  className="max-w-32 rounded-md p-[4px] text-sky-600 transition hover:bg-[#1414140d] hover:text-teal-800"
                >
                  {path.label}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </React.Fragment>
          ))}
          {currentPage && (
            <BreadcrumbItem>
              <BreadcrumbPage className="font-bold text-sky-600">
                {currentPage}
              </BreadcrumbPage>
            </BreadcrumbItem>
          )}
        </BreadcrumbList>
      </Breadcrumb>
    </>
  );
};

export default BreadcrumbDetail;
