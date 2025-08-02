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
  onClick?: React.MouseEventHandler;
}[];

export type BreadcrumbProps = {
  links: BreadcrumbLinks;
};

const Breadcrumb = function ({ links }: BreadcrumbProps) {
  const navigate = useNavigate();

  return (
    <div className="breadcrumb">
      {links?.map(function (link, index) {
        return (
          <React.Fragment key={link.id}>
            {index != 0 && links.length != index && (
              <CaretRight weight="bold" size={20} />
            )}
            <div id={link.id}>
              {link.url && link.urlExternal && (
                <a href={link.url} style={link.styles} target={link.target}>
                  {link.label}
                </a>
              )}
              {link.url && !link.urlExternal && (
                <a
                  href="#"
                  style={link.styles}
                  onClick={() => navigate(link.url as string)}
                >
                  {link.label}
                </a>
              )}
              {link.onClick && (
                <a href="#" style={link.styles} onClick={link.onClick}>
                  {link.label}
                </a>
              )}
              {!link.url && !link.onClick && (
                <span style={link.styles}>{link.label}</span>
              )}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default Breadcrumb;
