import { Checkbox } from "./Checkbox";
import React, { useRef } from "react";
import {
  useTableCell,
  useTableColumnHeader,
  useTableSelectAllCheckbox,
  useTableSelectionCheckbox,
  VisuallyHidden,
} from "react-aria";
import type { GridNode } from "@react-types/grid";
import type { TableState } from "react-stately";
import { TableColumnResizeState } from "@react-stately/table";

interface TableCheckboxCellProps<T> {
  cell: GridNode<T>;
  state: TableState<T>;
  layoutState: TableColumnResizeState<T>;
}

interface TableSelectAllCellProps<T> {
  column: GridNode<T>;
  state: TableState<T>;
  layoutState: TableColumnResizeState<T>;
}

export function TableCheckboxCell<T>(props: TableCheckboxCellProps<T>) {
  let { cell, state, layoutState } = props;
  let ref = useRef(null);
  let { gridCellProps } = useTableCell({ node: cell }, state, ref);
  let { checkboxProps } = useTableSelectionCheckbox(
    { key: cell.parentKey },
    state
  );
  let column = cell.column;

  return (
    <div
      {...gridCellProps}
      className={`w-[${layoutState.getColumnWidth(
        column.key
      )}px] flex box-border`}
      ref={ref}
    >
      <Checkbox {...checkboxProps} className="my-auto mx-1" />
    </div>
  );
}

export function TableSelectAllCell<T>(props: TableSelectAllCellProps<T>) {
  let { column, state, layoutState } = props;
  let ref = useRef(null);
  let { columnHeaderProps } = useTableColumnHeader(
    { node: column },
    state,
    ref
  );
  let { checkboxProps } = useTableSelectAllCheckbox(state);

  return (
    <div
      {...columnHeaderProps}
      className={`w-[${layoutState.getColumnWidth(
        column.key
      )}px] m-auto box-border`}
      ref={ref}
    >
      {state.selectionManager.selectionMode === "single" ? (
        <VisuallyHidden>{checkboxProps["aria-label"]}</VisuallyHidden>
      ) : (
        <Checkbox
          {...checkboxProps}
          className="my-auto mx-1"
          style={{ marginTop: "auto", marginBottom: "auto" }}
        />
      )}
    </div>
  );
}
