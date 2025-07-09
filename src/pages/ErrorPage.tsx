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
          title={t.pages.error}
          styles={{ width: "35rem" }}
          actions={[
            {
              type: "button",
              category: "Neutral",
              text: t.components.back,
              onClick: function () {
                navigate("/");
                return;
              },
            },
          ]}
        >
          {error instanceof Error ? (
            <code>
              {error.name}: {error.message}
            </code>
          ) : (
            "no message error"
          )}
        </Wrapper>
      </div>
    </Center>
  );
};

export default ErrorPage;
