import { useNavigate, useRouteError } from "react-router-dom";

// hooks
import useTranslate from "../hooks/useTranslate";

// components
import Wrapper from "../components/wrapper/Wrapper";
import { Center } from "../components/aligns/Align";

const ErrorPage = function () {
  const t = useTranslate();
  const error = useRouteError();
  const navigate = useNavigate();

  console.error("[src/pages/Error.tsx]", error);

  return (
    <Center>
      <div>
        <Wrapper
          title={t.error.title}
          description={t.error.description}
          styles={{ width: "35rem" }}
          actions={[
            {
              type: "button",
              category: "Neutral",
              text: t.error.back,
              onClick: function () {
                navigate("/");
                return;
              },
            },
          ]}
        >
          <div>
            {error instanceof Error ? error?.message : "no message error"}
          </div>
        </Wrapper>
      </div>
    </Center>
  );
};

export default ErrorPage;
