import React from "react";
import { CaretRight } from "@phosphor-icons/react";

// styles
import "./Breadcrumb.css";

export type BreadcrumbLinks = {
  id: string;
  label: string;
  url: string;
  target?: React.HTMLAttributeAnchorTarget;
}[];

export type BreadcrumbProps = {
  links: BreadcrumbLinks;
};

const Breadcrumb = function ({ links }: BreadcrumbProps) {
  return (
    <div className="breadcrumb">
      {links?.map(function ({ id, label, url, target }, index) {
        return (
          <React.Fragment key={id}>
            {index != 0 && links.length != index && <CaretRight />}
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
