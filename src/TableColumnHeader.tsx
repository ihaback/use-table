import type { GridNode } from "@react-types/grid";
import { Item } from "react-stately";
import { MenuTrigger } from "./Menu";
import {
  mergeProps,
  useHover,
  useFocusRing,
  useTableColumnHeader
} from "react-aria";
import React, { Key, useMemo, useRef } from "react";
import { Resizer } from "./Resizer";
import type { TableColumnResizeState } from "@react-stately/table";
import type { TableState } from "react-stately";

interface TableColumnHeaderProps<T> {
  column: GridNode<T>;
  state: TableState<T>;
  layoutState: TableColumnResizeState<T>;
  onResizeStart?: (widths: Map<Key, number | string>) => void;
  onResize?: (widths: Map<Key, number | string>) => void;
  onResizeEnd?: (widths: Map<Key, number | string>) => void;
}

interface MenuOptions {
  label: string;
  id: string;
}

export function TableColumnHeader<T>(props: TableColumnHeaderProps<T>) {
  let {
    column,
    state,
    layoutState,
    onResizeStart,
    onResize,
    onResizeEnd
  } = props;
  let ref = useRef(null);
  let resizerRef = useRef(null);
  let triggerRef = useRef(null);
  let { columnHeaderProps } = useTableColumnHeader(
    { node: column },
    state,
    ref
  );
  let { isFocusVisible, focusProps } = useFocusRing();
  let { hoverProps, isHovered } = useHover({});
  let showResizer = isHovered || layoutState.resizingColumn === column.key;
  let arrowIcon = state.sortDescriptor?.direction === "ascending" ? "▲" : "▼";
  let allowsSorting = column.props?.allowsSorting;
  let allowsResizing = column.props?.allowsResizing;

  // Actions that happen when user presses on the respective item in the table
  // column header dropdown menu
  const onMenuSelect = (key: string) => {
    switch (key) {
      case "sort-asc":
        state.sort(column.key, "ascending");
        break;
      case "sort-desc":
        state.sort(column.key, "descending");
        break;
      case "resize":
        // layoutState.onColumnResizeStart(column.key);
        layoutState.startResize(column.key);
        if (resizerRef) {
          // Brief delay before moving focus to resizer input for screenreaders/Safari
          setTimeout(() => resizerRef.current?.focus(), 50);
        }
        break;
    }
  };

  let items = useMemo(() => {
    let options = [
      allowsSorting
        ? {
            label: "Sort ascending",
            id: "sort-asc"
          }
        : undefined,
      allowsSorting
        ? {
            label: "Sort descending",
            id: "sort-desc"
          }
        : undefined,
      {
        label: "Resize column",
        id: "resize"
      }
    ];
    return options;
  }, [allowsSorting]);

  let sortVisible =
    state.sortDescriptor?.column === column.key ? "visible" : "hidden";
  let sortIcon = (
    <span aria-hidden="true" className={`${sortVisible} px-.5`}>
      {arrowIcon}
    </span>
  );

  let menuLabel = (
    <div className="flex truncate">
      {column.props.allowsSorting && sortIcon}
      <div className="truncate">{column.rendered}</div>
    </div>
  );

  // Only render a menu trigger as the table column header if resizing is allowed
  // otherwise clicking on the column header should sort if available
  let contents = allowsResizing ? (
    <>
      <MenuTrigger
        className="width-full text-left border-none bg-transparent flex-[1_1_auto] truncate"
        style={{
          marginInlineStart: "-6px"
        }}
        label={menuLabel}
        onAction={onMenuSelect}
        items={items}
        ref={triggerRef}
      >
        {(item: MenuOptions) => <Item>{item.label}</Item>}
      </MenuTrigger>
      <Resizer
        showResizer={showResizer}
        ref={resizerRef}
        triggerRef={triggerRef}
        column={column}
        layoutState={layoutState}
        onResizeStart={onResizeStart}
        onResize={onResize}
        onResizeEnd={onResizeEnd}
      />
    </>
  ) : (
    <div className="flex-[1_1_auto] truncate text-black text-sm font-semibold">
      {column.props.allowsSorting && sortIcon}
      {column.rendered}
    </div>
  );

  let textAlign = column.colspan > 1 ? "text-center" : "text-left";
  let boxShadow = isFocusVisible
    ? "shadow-[inset_0_0_0_2px_orange]"
    : "shadow-none";

  return (
    <div
      {...mergeProps(columnHeaderProps, focusProps, hoverProps)}
      className={`w-[${layoutState.getColumnWidth(
        column.key
      )}px] ${boxShadow} ${textAlign} px-2.5 py-1 cursor-default outline-none flex-[0_0_auto] box-border`}
      ref={ref}
    >
      <div className="flex relative">{contents}</div>
    </div>
  );
}
