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
          onClick={() => toast.success("Operação realizada com sucesso!")}
        />
        <Button
          category="secondary"
          text="Info Toast"
          Icon={Info}
          onClick={() => toast.info("Informação relevante exibida.")}
        />
        <Button
          category="warn"
          text="Warning Toast"
          Icon={Warning}
          onClick={() => toast.warning("Atenção: verifique os dados.")}
        />
        <Button
          category="danger"
          text="Error Toast"
          Icon={WarningOctagon}
          onClick={() => toast.error("Erro ao executar a ação.")}
        />
        <Button
          category="neutral"
          text="Loading Toast"
          Icon={Spinner}
          onClick={() => {
            toast.loading("Processando...");
            setTimeout(() => toast.success("Finalizado!"), 2000);
          }}
        />
      </div>
    </>
  );
};
