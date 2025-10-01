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
  ApiPreference,
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
import { InputSelect } from "../../components/inputs/Input";
import { useDialog } from "../../components/dialogs/Dialog";
import { Horizontal, Vertical } from "../../components/aligns/Align";

const DashboardExchangesIndexes = function () {
  const t = useTranslate();
  const play = useSounds();
  const { OpenDialog, CloseDialog } = useDialog();
  const { user, token, instance, preferences, setPreferences } = useSystem();

  const [loading, setLoading] = useState<boolean>(true);
  const [indexes, setIndexes] = useState<ApiIndexes>([]);
  const [euro, setEuro] = useState<ApiExchangeContent | null>(null);
  const [pound, setPound] = useState<ApiExchangeContent | null>(null);
  const [dollar, setDollar] = useState<ApiExchangeContent | null>(null);
  const [bitcoin, setBitcoin] = useState<ApiBitcoinContent | null>(null);

  const preferencesHidden =
    preferences?.hidden && typeof preferences?.hidden === "object"
      ? preferences?.hidden
      : {};

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

  const filterAction = function () {
    OpenDialog({
      width: 520,
      nonFooter: true,
      category: "Success",
      title: `${t.components.filter}: ${t.dashboard.exchanges_indexes}`,
      description: function () {
        const [hidden, setHidden] = useState<Record<string, boolean>>({
          ...preferencesHidden,
          exchanges: preferencesHidden?.exchanges || false,
          indexes: preferencesHidden?.indexes || false,
        });

        return (
          <Vertical internal={1}>
            <InputSelect
              empty={t.stacks.no_option}
              label={t.dashboard.exchanges}
              value={String(hidden?.exchanges)}
              options={[
                {
                  id: "true",
                  value: "true",
                  text: t.components.hide,
                },
                {
                  id: "false",
                  value: "false",
                  text: t.components.show,
                },
              ]}
              onChange={function (event) {
                const newHidden = { ...hidden };
                newHidden.exchanges = event.target?.value === "true";
                setHidden(newHidden);
                return;
              }}
            />
            <InputSelect
              empty={t.stacks.no_option}
              label={t.dashboard.indexes}
              value={String(hidden?.indexes)}
              options={[
                {
                  id: "true",
                  value: "true",
                  text: t.components.hide,
                },
                {
                  id: "false",
                  value: "false",
                  text: t.components.show,
                },
              ]}
              onChange={function (event) {
                const newHidden = { ...hidden };
                newHidden.indexes = event.target?.value === "true";
                setHidden(newHidden);
                return;
              }}
            />

            <Horizontal internal={1} styles={{ justifyContent: "flex-end" }}>
              <Button
                category="Neutral"
                text={t.components.cancel}
                onClick={CloseDialog}
              />
              <Button
                category="Info"
                text={t.components.filter}
                onClick={async function () {
                  try {
                    const response = await apis.Preference.set<ApiPreference>(
                      instance.name,
                      token,
                      user.id,
                      { hidden },
                    );
                    if (!response.data) {
                      play("alert");
                      toast.warning(t.toast.warning_error, {
                        description: t.toast.warning_filter,
                      });
                      return;
                    }
                    const newPreferences = { ...response.data.result };
                    delete newPreferences.id;
                    delete newPreferences.updatedAt;
                    delete newPreferences.userId;
                    setPreferences(newPreferences);
                    play("ok");
                    toast.success(t.toast.success, {
                      description: t.toast.success_filter,
                    });
                    CloseDialog();
                  } catch (err) {
                    play("alert");
                    toast.error(t.toast.warning_error, {
                      description: t.toast.error_filter,
                    });
                    console.error(
                      "[src/pages/dashboard/DashboardExchangesIndexes.tsx]",
                      err,
                    );
                  }
                  return;
                }}
              />
            </Horizontal>
          </Vertical>
        );
      },
    });
    return;
  };

  return (
    <React.Fragment>
      <Horizontal internal={1} className="itemsCenter">
        {!preferencesHidden?.exchanges && !preferencesHidden?.indexes && (
          <h3 className="flex1">{t.dashboard.exchanges_indexes}</h3>
        )}
        {preferencesHidden?.exchanges && !preferencesHidden?.indexes && (
          <h3 className="flex1">{t.dashboard.indexes}</h3>
        )}
        {!preferencesHidden?.exchanges && preferencesHidden?.indexes && (
          <h3 className="flex1">{t.dashboard.exchanges}</h3>
        )}

        <Button
          category="Neutral"
          Icon={FunnelSimple}
          text={t.components.filter}
          onClick={filterAction}
        />
      </Horizontal>

      {!preferencesHidden?.exchanges && (
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
            metricStatus={
              parseFloat(euro?.pctChange || "0") > 0 ? "Up" : "Down"
            }
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
            metricStatus={
              parseFloat(pound?.pctChange || "0") > 0 ? "Up" : "Down"
            }
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
      )}

      {!preferencesHidden?.indexes && (
        <Horizontal internal={1}>
          <Stats
            animation
            loading={loading}
            title={t.dashboard.stats_index_selic}
            Icon={PresentationChart}
            value={
              (indexes.find((index) => index.nome === "Selic")?.valor || 0) /
              100
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
      )}
    </React.Fragment>
  );
};

export default DashboardExchangesIndexes;
