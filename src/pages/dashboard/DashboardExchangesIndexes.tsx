import {
  LinkSimple,
  CurrencyBtc,
  FunnelSimple,
  CoinVertical,
  PresentationChart,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import React, { useState } from "react";

// apis
import apis from "../../apis";

// types
import {
  ApiIndexes,
  ApiBitcoinContent,
  ApiExchangeContent,
} from "../../types/Api";

// hooks
import useAsync from "../../hooks/useAsync";
import useSounds from "../../hooks/useSounds";
import useSystem from "../../hooks/useSystem";
import useTranslate from "../../hooks/useTranslate";

// components
import Stats from "../../components/stats/Stats";
import Button from "../../components/buttons/Button";
import { Horizontal } from "../../components/aligns/Align";

const DashboardExchangesIndexes = function () {
  const t = useTranslate();
  const play = useSounds();
  const { instance } = useSystem();

  const [loading, setLoading] = useState<boolean>(true);
  const [indexes, setIndexes] = useState<ApiIndexes>([]);
  const [euro, setEuro] = useState<ApiExchangeContent | null>(null);
  const [pound, setPound] = useState<ApiExchangeContent | null>(null);
  const [dollar, setDollar] = useState<ApiExchangeContent | null>(null);
  const [bitcoin, setBitcoin] = useState<ApiBitcoinContent | null>(null);

  // fetch exchanges and indexes
  useAsync(
    async function () {
      try {
        setLoading(true);
        if (!instance?.currency) return;

        if (instance.currency !== "USD") {
          const responseDollar = await apis.Exchange(
            `USD-${instance.currency}`,
          );
          if (!responseDollar.data) {
            play("alert");
            toast.warning(t.toast.warning_error, {
              description: t.stacks.no_find_item,
            });
            return;
          }
          const newDollar = Object.values(responseDollar.data)[0];
          setDollar(newDollar);
        }

        if (instance.currency !== "EUR") {
          const responseEuro = await apis.Exchange(`EUR-${instance.currency}`);
          if (!responseEuro.data) {
            play("alert");
            toast.warning(t.toast.warning_error, {
              description: t.stacks.no_find_item,
            });
            return;
          }
          const newEuro = Object.values(responseEuro.data)[0];
          setEuro(newEuro);
        }

        if (instance.currency !== "GBP") {
          const responsePound = await apis.Exchange(`GBP-${instance.currency}`);
          if (!responsePound.data) {
            play("alert");
            toast.warning(t.toast.warning_error, {
              description: t.stacks.no_find_item,
            });
            return;
          }
          const newPound = Object.values(responsePound.data)[0];
          setPound(newPound);
        }

        const responseBitcoin = await apis.Bitcoin();
        if (!responseBitcoin.data) {
          play("alert");
          toast.warning(t.toast.warning_error, {
            description: t.stacks.no_find_item,
          });
        }
        const newBitcoin = responseBitcoin.data?.[instance.currency] || null;
        setBitcoin(newBitcoin);

        const responeindexes = await apis.Indexes();
        if (!responeindexes.data) {
          play("alert");
          toast.warning(t.toast.warning_error, {
            description: t.stacks.no_find_item,
          });
        }
        const newIndexes = responeindexes.data || [];
        setIndexes(newIndexes);
      } catch (err) {
        play("alert");
        toast.error(t.toast.warning_error, {
          description: t.stacks.no_find_item,
        });
        console.error("[src/pages/Dashboard.tsx]", err);
      } finally {
        setLoading(false);
      }
      return;
    },
    [instance.currency],
  );

  return (
    <React.Fragment>
      <Horizontal internal={1} className="itemsCenter">
        <h3 className="flex1">{t.dashboard.exchange_indexes}</h3>
        <Button
          category="Neutral"
          Icon={FunnelSimple}
          text={t.components.filter}
        />
      </Horizontal>

      <Horizontal internal={1}>
        <Stats
          animation
          loading={loading}
          metric={Math.abs(parseFloat(dollar?.pctChange || "0")) / 100}
          metricStatus={
            parseFloat(dollar?.pctChange || "0") > 0 ? "Up" : "Down"
          }
          metricLocale={instance.language}
          metricOptions={{ style: "percent", minimumFractionDigits: 4 }}
          title={t.dashboard.stats_exchange_dollar}
          Icon={CoinVertical}
          value={parseFloat(dollar?.bid || "1")}
          valueLocale={instance.language}
          valueOptions={{ style: "currency", currency: instance.currency }}
        />

        <Stats
          animation
          loading={loading}
          metric={Math.abs(parseFloat(euro?.pctChange || "0")) / 100}
          metricStatus={parseFloat(euro?.pctChange || "0") > 0 ? "Up" : "Down"}
          metricLocale={instance.language}
          metricOptions={{ style: "percent", minimumFractionDigits: 4 }}
          title={t.dashboard.stats_exchange_euro}
          Icon={CoinVertical}
          value={parseFloat(euro?.bid || "1")}
          valueLocale={instance.language}
          valueOptions={{ style: "currency", currency: instance.currency }}
        />

        <Stats
          animation
          loading={loading}
          metric={Math.abs(parseFloat(pound?.pctChange || "0")) / 100}
          metricStatus={parseFloat(pound?.pctChange || "0") > 0 ? "Up" : "Down"}
          metricLocale={instance.language}
          metricOptions={{ style: "percent", minimumFractionDigits: 4 }}
          title={t.dashboard.stats_exchange_pound}
          Icon={CoinVertical}
          value={parseFloat(pound?.bid || "1")}
          valueLocale={instance.language}
          valueOptions={{ style: "currency", currency: instance.currency }}
        />

        <Stats
          animation
          loading={loading}
          title={t.dashboard.stats_exchange_bitcoin}
          Icon={CurrencyBtc}
          value={bitcoin?.buy || 0}
          valueLocale={instance.language}
          valueOptions={{ style: "currency", currency: instance.currency }}
        />
      </Horizontal>

      <Horizontal internal={1}>
        <Stats
          animation
          loading={loading}
          title={t.dashboard.stats_index_selic}
          Icon={PresentationChart}
          value={
            (indexes.find((index) => index.nome === "Selic")?.valor || 0) / 100
          }
          valueLocale={instance.language}
          valueOptions={{ style: "percent", minimumFractionDigits: 2 }}
          footer={
            <Horizontal internal={0.4} className="itemsCenter">
              <LinkSimple size={16} color="var(--infoColor)" />
              <a
                target="_blank"
                rel="noreferrer"
                href="https://www.bcb.gov.br/controleinflacao/taxaselic"
              >
                {t.dashboard.stats_index_selic_description}
              </a>
            </Horizontal>
          }
        />

        <Stats
          animation
          loading={loading}
          title={t.dashboard.stats_index_cdi}
          Icon={PresentationChart}
          value={
            (indexes.find((index) => index.nome === "CDI")?.valor || 0) / 100
          }
          valueLocale={instance.language}
          valueOptions={{ style: "percent", minimumFractionDigits: 2 }}
          footer={
            <Horizontal internal={0.4} className="itemsCenter">
              <LinkSimple size={16} color="var(--infoColor)" />
              <a
                href="https://pt.wikipedia.org/wiki/Certificado_de_Dep%C3%B3sito_Interbanc%C3%A1rio"
                target="_blank"
                rel="noreferrer"
              >
                {t.dashboard.stats_index_cdi_description}
              </a>
            </Horizontal>
          }
        />

        <Stats
          animation
          loading={loading}
          title={t.dashboard.stats_index_ipca}
          Icon={PresentationChart}
          value={
            (indexes.find((index) => index.nome === "IPCA")?.valor || 0) / 100
          }
          valueLocale={instance.language}
          valueOptions={{ style: "percent", minimumFractionDigits: 2 }}
          footer={
            <Horizontal internal={0.4} className="itemsCenter">
              <LinkSimple size={16} color="var(--infoColor)" />
              <a
                href="https://pt.wikipedia.org/wiki/%C3%8Dndice_de_pre%C3%A7os_no_consumidor"
                target="_blank"
                rel="noreferrer"
              >
                {t.dashboard.stats_index_ipca_description}
              </a>
            </Horizontal>
          }
        />
      </Horizontal>
    </React.Fragment>
  );
};

export default DashboardExchangesIndexes;
