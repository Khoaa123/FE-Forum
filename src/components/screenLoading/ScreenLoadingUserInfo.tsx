import React from "react";
import LoadingUserInfo from "../../../public/loading_profile.svg";
import Image from "next/image";
const ScreenLoadingUserInfo = () => {
  return (
    <>
      <div>
        <div className="fixed bottom-0 left-0 right-0 top-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div>
            <Image
              src={LoadingUserInfo}
              alt="LoadingUserInfo..."
              className="h-full w-full"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ScreenLoadingUserInfo;
