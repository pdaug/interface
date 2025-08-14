import { useNavigate } from "react-router-dom";

// hooks
import useTranslate from "../hooks/useTranslate";

// components
import Game from "../components/others/Game";
import Wrapper from "../components/wrapper/Wrapper";
import { Center } from "../components/aligns/Align";

const NotFound = function () {
  const t = useTranslate();
  const navigate = useNavigate();

  return (
    <Center>
      <div>
        <Wrapper
          title={t.pages.not_found}
          styles={{ width: "35rem" }}
          actions={[
            {
              type: "button",
              category: "Neutral",
              text: t.components.back,
              onClick: function () {
                navigate("/f");
                return;
              },
            },
          ]}
        >
          <div>{t.pages.not_found_description}</div>
          <Game />
        </Wrapper>
      </div>
    </Center>
  );
};

export default NotFound;
