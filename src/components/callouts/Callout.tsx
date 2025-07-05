import React from "react";
import { IconWeight, Icon as PhosphorIcons } from "@phosphor-icons/react";

// styles
import "./Callout.css";

export const CalloutCategoriesList = [
  "Success",
  "Info",
  "Warning",
  "Danger",
] as const;

export type CalloutCategories = (typeof CalloutCategoriesList)[number];

export type CalloutProps = {
  text: React.ReactNode;
  category: CalloutCategories;
  id?: string;
  Icon?: PhosphorIcons;
  IconWeight?: IconWeight;
  IconSize?: number;
  styles?: React.CSSProperties;
};

const Callout = function ({
  text,
  category,
  id,
  Icon,
  IconSize,
  IconWeight,
  styles,
}: CalloutProps) {
  return (
    <div id={id} className={`callout callout${category}`} style={styles}>
      <div>{Icon && <Icon weight={IconWeight} size={IconSize} />}</div>
      <span>{text}</span>
    </div>
  );
};

export default Callout;
