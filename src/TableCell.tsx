import type { GridNode } from "@react-types/grid";
import { mergeProps, useFocusRing, useTableCell } from "react-aria";
import React, { useRef } from "react";
import type { TableState } from "react-stately";
import { TableColumnResizeState } from "@react-stately/table";

interface TableCellProps<T> {
  cell: GridNode<T>;
  state: TableState<T>;
  layoutState: TableColumnResizeState<T>;
}

export function TableCell<T>(props: TableCellProps<T>) {
  let { cell, state, layoutState } = props;
  let ref = useRef(null);
  let { gridCellProps } = useTableCell({ node: cell }, state, ref);
  let { isFocusVisible, focusProps } = useFocusRing();
  let column = cell.column;
  let boxShadow = isFocusVisible
    ? "shadow-[inset_0_0_0_2px_orange]"
    : "shadow-none";

  return (
    <div
      {...mergeProps(gridCellProps, focusProps)}
      className={`w-[${layoutState.getColumnWidth(
        column.key
      )}px] ${boxShadow} px-2.5 py-1 cursor-default outline-none truncate flex-[0_0_auto] box-border`}
      ref={ref}
    >
      {cell.rendered}
    </div>
  );
}
