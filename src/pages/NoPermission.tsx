import { useNavigate } from "react-router-dom";

// hooks
import useTranslate from "../hooks/useTranslate";

// components
import Wrapper from "../components/wrapper/Wrapper";
import { Center } from "../components/aligns/Align";

type NoPermissionProps = {
  path?: string;
};

const NoPermission = function ({ path }: NoPermissionProps) {
  const t = useTranslate();
  const navigate = useNavigate();

  return (
    <Center>
      <div>
        <Wrapper
          title={t.pages.no_permission}
          styles={{ width: "35rem" }}
          actions={[
            {
              type: "button",
              category: "Neutral",
              text: t.components.back,
              onClick: function () {
                navigate(path || "/f");
                return;
              },
            },
          ]}
        >
          <div>{t.pages.no_permission_description}</div>
        </Wrapper>
      </div>
    </Center>
  );
};

export default NoPermission;
