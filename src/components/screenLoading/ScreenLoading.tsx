import Image from "next/image";
import React from "react";
import Loading from "../../../public/loading.svg";
const ScreenLoading = () => {
  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 top-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
        <div className="flex h-[100px] w-[100px] items-center justify-center overflow-hidden rounded-md bg-white shadow-lg">
          <Image src={Loading} alt="Loading..." className="h-full w-full" />
        </div>
      </div>
    </>
  );
};

export default ScreenLoading;
