import { useNavigate } from "react-router-dom";

// hooks
import useTranslate from "../hooks/useTranslate";

// components
import Wrapper from "../components/wrapper/Wrapper";
import { Center } from "../components/aligns/Align";

const NotFound = function () {
  const t = useTranslate();
  const navigate = useNavigate();

  return (
    <Center>
      <div>
        <Wrapper
          title={t.not_found.title}
          description={t.not_found.description}
          styles={{ width: "35rem" }}
          actions={[
            {
              type: "button",
              category: "Neutral",
              text: t.not_found.back,
              onClick: function () {
                navigate("/");
                return;
              },
            },
          ]}
        >
          <div>{t.not_found.text}</div>
        </Wrapper>
      </div>
    </Center>
  );
};

export default NotFound;
