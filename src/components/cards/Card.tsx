import React from "react";
import { ImageBroken } from "@phosphor-icons/react";

// styles
import "./Card.css";

export type CardProps = {
  mode: "Small" | "Large";
  photo?: string | null;
  photoChildren?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

const Card = function ({
  mode = "Large",
  photo,
  photoChildren,
  children,
  footer,
}: CardProps) {
  return (
    <div className={`card card${mode}`}>
      {(typeof photo === "string" || photoChildren) && (
        <div className="cardPhoto">
          {photo ? (
            <img src={photo} alt="card_photo" />
          ) : (
            <ImageBroken color="var(--borderDark)" size={32} weight="light" />
          )}
          <div className="cardPhotoChildren">{photoChildren}</div>
        </div>
      )}
      <div className="cardContent">{children}</div>
      {footer && <div className="cardFooter">{footer}</div>}
    </div>
  );
};

export default Card;
