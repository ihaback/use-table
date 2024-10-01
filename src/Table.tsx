import type { ColumnSize, TableProps } from "@react-types/table";
import type { SelectionBehavior } from "@react-types/shared";
import { getInteractionModality } from "@react-aria/interactions";
import type { GridNode } from "@react-types/grid";
import React, {
  CSSProperties,
  Key,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useResizeObserver } from "@react-aria/utils";
import { AriaTableProps, useTable } from "react-aria";
import { useTableState } from "react-stately";
import { useTableColumnResizeState } from "@react-stately/table";
import { TableRowGroup } from "./TableRowGroup";
import { TableHeaderRow } from "./TableHeaderRow";
import { TableColumnHeader } from "./TableColumnHeader";
import { TableCheckboxCell, TableSelectAllCell } from "./TableCheckbox";
import { TableCell } from "./TableCell";
import { TableRow } from "./TableRow";

interface TableComponentProps<T> extends AriaTableProps, TableProps<T> {
  selectionBehavior?: SelectionBehavior;
  onResizeStart?: (widths: Map<Key, ColumnSize>) => void;
  onResize?: (widths: Map<Key, ColumnSize>) => void;
  onResizeEnd?: (widths: Map<Key, ColumnSize>) => void;
  children: any;
  style?: CSSProperties;
}

export function Table<T extends object>(props: TableComponentProps<T>) {
  let {
    selectionMode,
    selectionBehavior,
    onResizeStart,
    onResize,
    onResizeEnd,
    style,
  } = props;

  let ref = useRef(null);
  let bodyRef = useRef(null);
  let headerRef = useRef(null);
  // Track the width of the table viewport (not the actual table body width)
  // for useTableColumnResizeState. This allows us to update column widths if
  // the table's width is dynamic instead of a static value (e.g. a percentage/vw value)
  let [tableWidth, setTableWidth] = useState(0);
  let state = useTableState({
    ...props,
    showSelectionCheckboxes:
      selectionMode === "multiple" && selectionBehavior !== "replace",
  });

  let { collection } = state;
  let { gridProps } = useTable(props as any, state, ref);

  // Selection cell column should always take up a specific width, doesn't need to be resizable
  // All other columns have a undefined default width and a min width of 75px
  let getDefaultWidth = useCallback((node: GridNode<object>) => {
    if (node.props.isSelectionCell) {
      return 20;
    }
    return undefined;
  }, []);

  let getDefaultMinWidth = useCallback((node: GridNode<object>) => {
    if (node.props.isSelectionCell) {
      return 20;
    }
    return 75;
  }, []);

  let layoutState = useTableColumnResizeState(
    {
      getDefaultWidth,
      getDefaultMinWidth,
      tableWidth: tableWidth,
    },
    state
  );

  // Update the tracked width of the table viewport in case of resize operations
  // e.g. provided width to the table is something like 70vw
  useLayoutEffect(() => {
    if (ref && ref.current) {
      setTableWidth(ref.current.clientWidth);
    }
  }, []);

  useResizeObserver({
    ref,
    onResize: () => setTableWidth(ref.current.clientWidth),
  });

  // The table body itself is scrollable, sync the table header to the body scroll position
  // to keep columns and body cells are aligned
  let onBodyScroll = () => {
    let bodyScroll = bodyRef.current.scrollLeft;
    headerRef.current.scrollLeft = bodyScroll;
  };

  // If scrolling the column header row via keyboard navigation, sync the body
  // so the columns and body cells are aligned
  let onHeaderScroll = () => {
    if (
      getInteractionModality() === "keyboard" &&
      headerRef.current.contains(document.activeElement)
    ) {
      let headerScroll = headerRef.current.scrollLeft;
      bodyRef.current.scrollLeft = headerScroll;
    }
  };

  return (
    <div
      {...gridProps}
      ref={ref}
      className="border-collapse relative"
      style={style}
    >
      <TableRowGroup
        type="div"
        ref={headerRef}
        className="block sticky top-0 truncate"
        onScroll={onHeaderScroll}
      >
        {collection.headerRows.map((headerRow) => (
          <TableHeaderRow key={headerRow.key} item={headerRow} state={state}>
            {[...headerRow.childNodes].map((column) =>
              column.props.isSelectionCell ? (
                <TableSelectAllCell
                  key={column.key}
                  column={column}
                  state={state}
                  layoutState={layoutState}
                />
              ) : (
                <TableColumnHeader
                  key={column.key}
                  column={column}
                  state={state}
                  layoutState={layoutState}
                  onResizeStart={onResizeStart}
                  onResize={onResize}
                  onResizeEnd={onResizeEnd}
                />
              )
            )}
          </TableHeaderRow>
        ))}
      </TableRowGroup>
      <TableRowGroup
        ref={bodyRef}
        onScroll={onBodyScroll}
        className="overflow-auto h-52"
        type="div"
      >
        {[...collection.body.childNodes].map((row) => (
          <TableRow key={row.key} item={row} state={state}>
            {[...row.childNodes].map((cell) =>
              cell.props.isSelectionCell ? (
                <TableCheckboxCell
                  key={cell.key}
                  cell={cell}
                  state={state}
                  layoutState={layoutState}
                />
              ) : (
                <TableCell
                  key={cell.key}
                  cell={cell}
                  state={state}
                  layoutState={layoutState}
                />
              )
            )}
          </TableRow>
        ))}
      </TableRowGroup>
    </div>
  );
}
