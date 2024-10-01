import type { GridNode } from "@react-types/grid";
import { mergeProps, useFocusRing, useTableRow } from "react-aria";
import React, { ReactNode, useRef } from "react";
import type { TableState } from "react-stately";

interface TableRowProps<T> {
  item: GridNode<T>;
  children: ReactNode;
  state: TableState<T>;
}

export function TableRow<T>(props: TableRowProps<T>) {
  let { item, children, state } = props;
  let ref = useRef(null);
  let isSelected = state.selectionManager.isSelected(item.key);
  let { rowProps, isPressed, allowsSelection } = useTableRow(
    {
      node: item,
    },
    state,
    ref
  );
  let { isFocusVisible, focusProps } = useFocusRing();
  let background;
  let color;
  if (isSelected) {
    color = "text-white";
    background = "bg-violet-800";
  } else if (isPressed) {
    background = "bg-slate-400";
  } else if (item.index % 2) {
    background = "bg-slate-200";
  } else {
    background = "none";
  }

  let boxShadow = isFocusVisible
    ? "shadow-[inset_0_0_0_2px_orange]"
    : "shadow-none";

  return (
    <div
      className={`${background} ${color} outline-none ${boxShadow} flex w-fit`}
      {...mergeProps(rowProps, focusProps)}
      ref={ref}
    >
      {children}
    </div>
  );
}
