import React from "react";
import { CaretRight, Icon as PhosphorIcon } from "@phosphor-icons/react";

// styles
import "./Breadcrumb.css";

export type BreadcrumbLinks = {
  id: string;
  label: string;
  url: string;
  target?: React.HTMLAttributeAnchorTarget;
}[];

export type BreadcrumbProps = {
  Icon: PhosphorIcon;
  links: BreadcrumbLinks;
};

const Breadcrumb = function ({ Icon, links }: BreadcrumbProps) {
  return (
    <div className="baseui-breadcrumb">
      <Icon weight="fill" size={20} />
      {links?.map(function ({ id, label, url, target }) {
        return (
          <React.Fragment key={id}>
            <CaretRight weight="bold" />
            <div id={id}>
              <a href={url} target={target}>
                {label}
              </a>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default Breadcrumb;
