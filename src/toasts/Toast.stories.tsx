import {
  Info,
  Warning,
  Spinner,
  CheckCircle,
  WarningOctagon,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import { Meta } from "@storybook/react";

import Button from "../buttons/Button";
import { ToastElement } from "./Toast";

const meta: Meta = {
  title: "components/Toast",
  component: ToastElement,
};

export default meta;

export const AllToasts = () => {
  return (
    <>
      <ToastElement />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          padding: "1rem",
        }}
      >
        <Button
          category="primary"
          text="Success Toast"
          Icon={CheckCircle}
          IconSize={16}
          onClick={() => toast.success("Operação realizada com sucesso!")}
        />
        <Button
          category="secondary"
          text="Info Toast"
          Icon={Info}
          IconSize={16}
          onClick={() => toast.info("Informação relevante exibida.")}
        />
        <Button
          category="warn"
          text="Warning Toast"
          Icon={Warning}
          IconSize={16}
          onClick={() => toast.warning("Atenção: verifique os dados.")}
        />
        <Button
          category="danger"
          text="Error Toast"
          Icon={WarningOctagon}
          IconSize={16}
          onClick={() => toast.error("Erro ao executar a ação.")}
        />
        <Button
          category="neutral"
          text="Loading Toast"
          Icon={Spinner}
          IconSize={16}
          onClick={() => {
            toast.loading("Processando...");
            setTimeout(() => toast.success("Finalizado!"), 2000);
          }}
        />
      </div>
    </>
  );
};
