import React from "react";
import { useNavigate } from "react-router-dom";
import { CaretRight } from "@phosphor-icons/react";

// styles
import "./Breadcrumb.css";

export type BreadcrumbLinks = {
  id: string;
  label: string;
  url?: string;
  urlExternal?: boolean;
  target?: React.HTMLAttributeAnchorTarget;
  styles?: React.CSSProperties;
}[];

export type BreadcrumbProps = {
  links: BreadcrumbLinks;
};

const Breadcrumb = function ({ links }: BreadcrumbProps) {
  const navigate = useNavigate();

  return (
    <div className="breadcrumb">
      {links?.map(function (
        { id, label, url, urlExternal, target, styles },
        index,
      ) {
        return (
          <React.Fragment key={id}>
            {index != 0 && links.length != index && (
              <CaretRight weight="bold" size={20} />
            )}
            <div id={id}>
              {url ? (
                urlExternal ? (
                  <a href={url} style={styles} target={target}>
                    {label}
                  </a>
                ) : (
                  <a href="#" style={styles} onClick={() => navigate(url)}>
                    {label}
                  </a>
                )
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
