import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative flex h-screen w-full items-center justify-center flex-col">
      <div className="w-full flex justify-center items-center"> {children}</div>
    </div>
  );
};

export default layout;
