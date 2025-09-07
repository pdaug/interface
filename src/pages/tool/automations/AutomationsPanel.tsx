import { useState } from "react";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  BaseEdge,
  Connection,
  Edge,
  EdgeChange,
  getSmoothStepPath,
  Handle,
  Node,
  NodeChange,
  Position,
  ReactFlow,
} from "@xyflow/react";

// components
import Badge from "../../../components/badges/Badge";
import { Vertical } from "../../../components/aligns/Align";
import {
  Input,
  InputSelect,
  InputText,
} from "../../../components/inputs/Input";

// hooks
import useTranslate from "../../../hooks/useTranslate";

const AutomationsPanel = function () {
  const t = useTranslate();

  const [nodes, setNodes] = useState<Node[]>([
    {
      id: "start",
      type: "eventNode",
      position: { x: -200, y: 0 },
      data: {},
    },
    {
      id: "message1",
      type: "senderNode",
      position: { x: 200, y: -150 },
      data: {},
    },
    {
      id: "transformer1",
      type: "transformerNode",
      position: { x: 200, y: 150 },
      data: {},
    },
    {
      id: "generator1",
      type: "generatorNode",
      position: { x: 560, y: 100 },
      data: {},
    },
  ]);
  const [edges, setEdges] = useState<Edge[]>([
    {
      id: "start-message1",
      source: "start",
      target: "message1",
      type: "dashed",
    },
    {
      id: "start-transformer1",
      source: "start",
      target: "transformer1",
      type: "dashed",
    },
    {
      id: "transformer1-generator1",
      source: "transformer1",
      target: "generator1",
      type: "dashed",
    },
  ]);

  const onNodesChange = function (changes: NodeChange[]) {
    const newNodes = applyNodeChanges(changes, nodes);
    setNodes(newNodes as unknown as typeof nodes);
    return;
  };

  const onEdgesChange = function (changes: EdgeChange[]) {
    const newEdges = applyEdgeChanges(changes, edges);
    setEdges(newEdges);
    return;
  };

  const onConnect = function (params: Connection) {
    const newEdges = addEdge(params, edges);
    setEdges(newEdges);
    return;
  };

  return (
    <ReactFlow
      fitView
      nodes={nodes}
      edges={edges}
      onConnect={onConnect}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      // remove watermark
      proOptions={{ hideAttribution: true }}
      // nodes custom
      nodeTypes={{
        eventNode: function () {
          return (
            <div
              style={{
                background: "white",
                // border: "1px solid var(--borderColor)",
                borderRadius: "var(--borderRadius)",
                boxShadow: "var(--shadow)",
                margin: 0,
                overflow: "hidden",
                padding: 0,
                minWidth: 240,
              }}
            >
              <div
                style={{
                  background: "var(--backgroundColor)",
                  border: "1px solid var(--borderColor)",
                  borderTopLeftRadius: "var(--borderRadius)",
                  borderTopRightRadius: "var(--borderRadius)",
                  fontSize: "var(--textRegular)",
                  padding: "0.4rem",
                }}
              >
                <Badge
                  category="Info"
                  value="Evento"
                  styles={{ width: "min-content" }}
                />
              </div>
              <div
                style={{
                  borderBottom: "1px solid var(--borderColor)",
                  borderLeft: "1px solid var(--borderColor)",
                  borderRight: "1px solid var(--borderColor)",
                  borderBottomLeftRadius: "var(--borderRadius)",
                  borderBottomRightRadius: "var(--borderRadius)",
                  fontSize: "var(--textSmall)",
                  padding: "0.6rem",
                }}
              >
                <Vertical internal={0.6}>
                  <InputSelect
                    value="customer"
                    label="Quando"
                    empty={t.stacks.no_option}
                    options={[
                      {
                        id: "customer",
                        value: "customer",
                        text: "Cliente",
                      },
                      {
                        id: "supplier",
                        value: "supplier",
                        text: "Fornecedores",
                      },
                    ]}
                  />
                  <InputSelect
                    label="For"
                    empty={t.stacks.no_option}
                    value="create"
                    options={[
                      {
                        id: "create",
                        value: "create",
                        text: "Criado",
                      },
                      {
                        id: "update",
                        value: "update",
                        text: "Atualizado",
                      },
                      {
                        id: "delete",
                        value: "delete",
                        text: "Deletado",
                      },
                    ]}
                  />
                </Vertical>
              </div>
              <Handle
                id="abc"
                type="source"
                position={"right" as Position}
                style={{
                  background: "var(--infoLight)",
                  border: "1px solid var(--infoColor)",
                  height: 10,
                  width: 10,
                }}
              />
            </div>
          );
        },

        senderNode: function () {
          return (
            <div
              style={{
                background: "white",
                // border: "1px solid var(--borderColor)",
                borderRadius: "var(--borderRadius)",
                boxShadow: "var(--shadow)",
                margin: 0,
                overflow: "hidden",
                padding: 0,
                minWidth: 240,
              }}
            >
              <div
                style={{
                  background: "var(--backgroundColor)",
                  border: "1px solid var(--borderColor)",
                  borderTopLeftRadius: "var(--borderRadius)",
                  borderTopRightRadius: "var(--borderRadius)",
                  fontSize: "var(--textRegular)",
                  padding: "0.4rem",
                }}
              >
                <Badge
                  category="Warning"
                  value="Ação: Disparador"
                  styles={{ width: "min-content" }}
                />
              </div>
              <div
                style={{
                  borderBottom: "1px solid var(--borderColor)",
                  borderLeft: "1px solid var(--borderColor)",
                  borderRight: "1px solid var(--borderColor)",
                  borderBottomLeftRadius: "var(--borderRadius)",
                  borderBottomRightRadius: "var(--borderRadius)",
                  fontSize: "var(--textSmall)",
                  padding: "0.6rem",
                }}
              >
                <Vertical internal={0.6}>
                  <InputSelect
                    value="whatsapp"
                    label="Integração"
                    empty={t.stacks.no_option}
                    options={[
                      {
                        id: "whatsapp",
                        value: "whatsapp",
                        text: "WhatsApp",
                      },
                      {
                        id: "email",
                        value: "email",
                        text: "Email",
                      },
                      {
                        id: "sms",
                        value: "sms",
                        text: "SMS",
                      },
                    ]}
                  />
                  <InputSelect
                    label="Para"
                    value="mobile"
                    empty={t.stacks.no_option}
                    options={[
                      {
                        id: "mobile",
                        value: "mobile",
                        text: "Celular",
                      },
                      {
                        id: "phone1",
                        value: "phone1",
                        text: "Telefone 1",
                      },
                      {
                        id: "phone2",
                        value: "phone2",
                        text: "Telefone 2",
                      },
                      {
                        id: "email",
                        value: "email",
                        text: "Email",
                        disabled: true,
                      },
                    ]}
                  />
                  <InputSelect
                    value="doc1"
                    label="Conteúdo"
                    empty={t.stacks.no_option}
                    options={[
                      {
                        id: "doc1",
                        value: "doc1",
                        text: "Mensagem de boas vindas",
                      },
                    ]}
                  />
                </Vertical>
              </div>
              <Handle
                id="abc"
                type="target"
                position={"left" as Position}
                style={{
                  background: "var(--warningLight)",
                  border: "1px solid var(--warningColor)",
                  height: 10,
                  width: 10,
                }}
              />
            </div>
          );
        },

        transformerNode: function () {
          return (
            <div
              style={{
                background: "white",
                borderRadius: "var(--borderRadius)",
                boxShadow: "var(--shadow)",
                margin: 0,
                overflow: "hidden",
                padding: 0,
                minWidth: 240,
              }}
            >
              <div
                style={{
                  background: "var(--backgroundColor)",
                  border: "1px solid var(--borderColor)",
                  borderTopLeftRadius: "var(--borderRadius)",
                  borderTopRightRadius: "var(--borderRadius)",
                  fontSize: "var(--textRegular)",
                  padding: "0.4rem",
                }}
              >
                <Badge
                  category="Success"
                  value="Transformador: IA"
                  styles={{ width: "min-content" }}
                />
              </div>
              <div
                style={{
                  borderBottom: "1px solid var(--borderColor)",
                  borderLeft: "1px solid var(--borderColor)",
                  borderRight: "1px solid var(--borderColor)",
                  borderBottomLeftRadius: "var(--borderRadius)",
                  borderBottomRightRadius: "var(--borderRadius)",
                  fontSize: "var(--textSmall)",
                  padding: "0.6rem",
                }}
              >
                <Vertical internal={0.6}>
                  <InputSelect
                    label="Modelo"
                    value="gpt-5"
                    empty={t.stacks.no_option}
                    options={[
                      {
                        id: "gpt-5",
                        value: "gpt-5",
                        text: "OpenAI GPT-5",
                      },
                    ]}
                  />
                  <InputText
                    label="Prompt"
                    placeholder=""
                    value="Pegue os dados desse cliente e formalize uma venda"
                    onChange={function () {
                      return;
                    }}
                  />
                </Vertical>
              </div>
              <Handle
                type="source"
                position={"right" as Position}
                style={{
                  background: "var(--successLight)",
                  border: "1px solid var(--successColor)",
                  height: 10,
                  width: 10,
                  top: 32,
                }}
              ></Handle>
              <Handle
                type="source"
                position={"right" as Position}
                style={{
                  background: "var(--dangerLight)",
                  border: "1px solid var(--dangerColor)",
                  borderRadius: "0",
                  height: 10,
                  width: 10,
                  top: 64,
                }}
              ></Handle>
              <Handle
                type="target"
                position={"left" as Position}
                style={{
                  background: "var(--successLight)",
                  border: "1px solid var(--successColor)",
                  height: 10,
                  width: 10,
                }}
              />
            </div>
          );
        },

        generatorNode: function () {
          return (
            <div
              style={{
                background: "white",
                // border: "1px solid var(--borderColor)",
                borderRadius: "var(--borderRadius)",
                boxShadow: "var(--shadow)",
                margin: 0,
                overflow: "hidden",
                padding: 0,
                minWidth: 240,
              }}
            >
              <div
                style={{
                  background: "var(--backgroundColor)",
                  border: "1px solid var(--borderColor)",
                  borderTopLeftRadius: "var(--borderRadius)",
                  borderTopRightRadius: "var(--borderRadius)",
                  fontSize: "var(--textRegular)",
                  padding: "0.4rem",
                }}
              >
                <Badge
                  category="Warning"
                  value="Ação: Gerador"
                  styles={{ width: "min-content" }}
                />
              </div>
              <div
                style={{
                  borderBottom: "1px solid var(--borderColor)",
                  borderLeft: "1px solid var(--borderColor)",
                  borderRight: "1px solid var(--borderColor)",
                  borderBottomLeftRadius: "var(--borderRadius)",
                  borderBottomRightRadius: "var(--borderRadius)",
                  fontSize: "var(--textSmall)",
                  padding: "0.6rem",
                }}
              >
                <Vertical internal={0.6}>
                  <InputSelect
                    value="sale"
                    label="Gerar um(a) novo(a)"
                    empty={t.stacks.no_option}
                    options={[
                      {
                        id: "sale",
                        value: "sale",
                        text: "Venda",
                      },
                      {
                        id: "order",
                        value: "order",
                        text: "Ordem",
                      },
                    ]}
                  />
                  <InputSelect
                    label="Para"
                    value="user1"
                    empty={t.stacks.no_option}
                    options={[
                      {
                        id: "user1",
                        value: "user1",
                        text: "Fulano de Tal",
                      },
                    ]}
                  />
                  <Input
                    label="Nome"
                    placeholder=""
                    value="Venda {{saleId}}"
                    stylesInput={{ fontFamily: "monospace" }}
                    onChange={function () {
                      return;
                    }}
                  />
                </Vertical>
              </div>
              <Handle
                type="target"
                position={"left" as Position}
                style={{
                  background: "var(--warningLight)",
                  border: "1px solid var(--warningColor)",
                  height: 10,
                  width: 10,
                }}
              />
            </div>
          );
        },
      }}
      // edge custom
      edgeTypes={{
        dashed: function ({
          id,
          sourceX,
          sourceY,
          targetX,
          targetY,
          sourcePosition,
          targetPosition,
          markerEnd,
        }) {
          const [edgePath] = getSmoothStepPath({
            sourceX,
            sourceY,
            targetX,
            targetY,
            sourcePosition,
            targetPosition,
            borderRadius: 0,
          });

          return (
            <BaseEdge
              id={id}
              path={edgePath}
              markerEnd={markerEnd}
              type="step"
              style={{
                stroke: "var(--infoColor)",
                strokeWidth: 2,
                strokeDasharray: "5,5",
                animation: "dashmove 0.6s linear infinite", // 👈 animação
              }}
            />
          );
        },
      }}
      // remove zoom
      minZoom={1}
      maxZoom={1}
      zoomOnScroll={false}
      zoomOnPinch={false}
      panOnScroll={false}
    />
  );
};

export default AutomationsPanel;
