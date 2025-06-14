import React from "react";
import { CaretRight } from "@phosphor-icons/react";

// styles
import "./Breadcrumb.css";

export type BreadcrumbLinks = {
  id: string;
  label: string;
  url?: string;
  target?: React.HTMLAttributeAnchorTarget;
  styles?: React.CSSProperties;
}[];

export type BreadcrumbProps = {
  links: BreadcrumbLinks;
};

const Breadcrumb = function ({ links }: BreadcrumbProps) {
  return (
    <div className="breadcrumb">
      {links?.map(function ({ id, label, url, target, styles }, index) {
        return (
          <React.Fragment key={id}>
            {index != 0 && links.length != index && <CaretRight />}
            <div id={id}>
              {url ? (
                <a href={url} style={styles} target={target}>
                  {label}
                </a>
              ) : (
                <span style={styles}>{label}</span>
              )}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default Breadcrumb;
