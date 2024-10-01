import type { GridNode } from "@react-types/grid";
import React, { ReactNode, useRef } from "react";
import { useTableHeaderRow } from "react-aria";
import type { TableState } from "react-stately";

interface TableHeaderRowProps<T> {
  item: GridNode<T>;
  children: ReactNode;
  state: TableState<T>;
}

export function TableHeaderRow<T>(props: TableHeaderRowProps<T>) {
  let { item, children, state } = props;
  let ref = useRef(null);
  let { rowProps } = useTableHeaderRow({ node: item }, state, ref);

  return (
    <div
      {...rowProps}
      ref={ref}
      className="flex border-b-2 border-solid border-slate-800 w-fit"
    >
      {children}
    </div>
  );
}
