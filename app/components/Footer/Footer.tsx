import { FooterHelp, Link } from "@shopify/polaris";

import React from "react";

interface IFooter {
  text: string;
  url: string;
}

export const Footer: React.FC<IFooter> = ({ url, text }) => {
  return (
    <FooterHelp>
      Learn More about <Link url={url}>{text}</Link>
    </FooterHelp>
  );
};
