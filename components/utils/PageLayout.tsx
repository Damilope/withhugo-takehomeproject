import React from "react";

export interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = (props) => {
  const { children } = props;
  return <div className="max-w-lg m-auto">{children}</div>;
};

export default PageLayout;
