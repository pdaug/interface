import { CaretLeft, CaretRight } from "@phosphor-icons/react";

// styles
import "./Pagination.css";

// hooks
import useTranslate from "../../hooks/useTranslate";

export type PaginationProps = {
  display?: boolean;
  pageCurrent: number;
  pageSize: number;
  itemsTotal: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  styles?: React.CSSProperties;
};

const Pagination = function ({
  display,
  pageCurrent,
  pageSize = 10,
  itemsTotal,
  setPage,
  styles,
}: PaginationProps) {
  const t = useTranslate();

  const pageTotal = Math.ceil(itemsTotal / pageSize);

  const GoPageStart = function () {
    setPage(1);
    return;
  };

  const GoPageEnd = function () {
    setPage(pageTotal);
    return;
  };

  const GoPageBack = function () {
    setPage(pageCurrent - 1);
    return;
  };

  const GoPageNext = function () {
    setPage(pageCurrent + 1);
    return;
  };

  const GoPage = function (value: number, operation: "add" | "sub") {
    if (operation === "add") setPage(pageCurrent + value);
    if (operation === "sub") setPage(pageCurrent - value);
    return;
  };

  return (
    <div className="pagination" style={styles}>
      {display && (
        <div className="paginationData">
          <span>{t.components.pagination_showing}</span>
          <b>{pageCurrent}</b>
          <span>{t.components.pagination_of}</span>
          <b>{pageTotal}</b>
          <span>{t.components.pagination_page} -</span>
          <b>{itemsTotal}</b>
          <span>{t.components.pagination_items}</span>
        </div>
      )}
      <div className="paginationButtons">
        <button
          onClick={GoPageStart}
          disabled={pageCurrent === 1}
          className="paginationButtonLeft"
        >
          <CaretLeft />
        </button>
        {pageCurrent === pageTotal && pageCurrent - 2 > 0 && (
          <button
            onClick={() => GoPage(2, "sub")}
            className={`paginationButtonCenter`}
          >
            {pageCurrent - 2}
          </button>
        )}
        {pageCurrent - 1 > 0 && (
          <button
            onClick={GoPageBack}
            disabled={pageCurrent - 1 <= 0}
            className={`paginationButtonCenter`}
          >
            {pageCurrent - 1}
          </button>
        )}
        <button className={`paginationButtonCenter paginationButtonsSelected`}>
          {pageCurrent}
        </button>
        {pageCurrent + 1 <= pageTotal && (
          <button
            onClick={GoPageNext}
            disabled={pageCurrent + 1 > pageTotal}
            className={`paginationButtonCenter`}
          >
            {pageCurrent + 1}
          </button>
        )}
        {pageCurrent - 1 === 0 && pageCurrent + 2 <= pageTotal && (
          <button
            onClick={() => GoPage(2, "add")}
            className={`paginationButtonCenter`}
          >
            {pageCurrent + 2}
          </button>
        )}
        <button
          onClick={GoPageEnd}
          disabled={pageCurrent === pageTotal}
          className="paginationButtonRight"
        >
          <CaretRight />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
