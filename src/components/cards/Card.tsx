import { DotsThreeOutline, ImageBroken } from "@phosphor-icons/react";

// styles
import "./Card.css";

// hooks
import useTranslate from "../../hooks/useTranslate";

// components
import { Horizontal } from "../aligns/Align";
import Profile, { ProfileProps } from "../profiles/Profile";
import Dropdown, { DropdownValue } from "../dropdowns/Dropdown";

export type CardProps = {
  small?: boolean;
  photo?: string | null;
  states?: React.ReactNode;
  name: string;
  description: string;
  price: string;
  data?: Record<string, unknown>;
  options?: DropdownValue[];
  profile?: ProfileProps;
};

const Card = function ({
  small,
  photo,
  name,
  states,
  description,
  price,
  data,
  options,
  profile,
}: CardProps) {
  const t = useTranslate();

  return (
    <div className={`card ${small ? "cardSmall" : "cardLarge"}`}>
      <div className="cardPhoto">
        <div className="cardPhotoStates">{states}</div>
        {photo ? (
          <img src={photo} alt="card_photo" />
        ) : (
          <ImageBroken color="var(--borderDark)" size={32} weight="light" />
        )}
      </div>
      <div className="cardContent">
        <div className="cardInfo">
          <div className="cardName">{name || "\u200B"} </div>
          <div className="cardDescription">
            {description || <i>{t.stacks.no_description}</i>}
          </div>
        </div>
        <div className="cardPrice">{price}</div>
        <Horizontal internal={0.4} styles={{ alignItems: "center" }}>
          <div className="flex1">{profile && <Profile {...profile} />}</div>
          {options && data && (
            <Dropdown values={options} data={data}>
              <div
                style={{
                  fontSize: "var(--textSmall)",
                  lineHeight: 1,
                  cursor: "pointer",
                }}
              >
                <DotsThreeOutline weight="fill" />
              </div>
            </Dropdown>
          )}
        </Horizontal>
      </div>
    </div>
  );
};

export default Card;
