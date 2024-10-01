import type { GridNode } from "@react-types/grid";
import React, { Key, ReactElement, RefObject } from "react";
import type { TableColumnResizeState } from "@react-stately/table";
import { useTableColumnResize } from "@react-aria/table";
import { VisuallyHidden } from "react-aria";

interface ResizerProps<T> {
  column: GridNode<T>;
  layoutState: TableColumnResizeState<T>;
  onResizeStart?: (widths: Map<Key, number | string>) => void;
  onResize?: (widths: Map<Key, number | string>) => void;
  onResizeEnd?: (widths: Map<Key, number | string>) => void;
  triggerRef: RefObject<HTMLButtonElement>;
  showResizer: boolean;
}

function Resizer<T>(props: ResizerProps<T>, ref: RefObject<HTMLInputElement>) {
  let {
    column,
    layoutState,
    onResizeStart,
    onResize,
    onResizeEnd,
    triggerRef,
    showResizer
  } = props;
  let { resizerProps, inputProps } = useTableColumnResize(
    {
      column,
      "aria-label": "Resizer",
      onResizeStart,
      onResize,
      onResizeEnd,
      triggerRef
    },
    layoutState,
    ref
  );

  let borderColor =
    layoutState.resizingColumn === column.key
      ? "border-[orange]"
      : "border-slate-800";
  let visiblity = showResizer ? "visible" : "invisible";
  return (
    <div
      role="presentation"
      className={`w-[6px] h-auto cursor-col-resize h-auto border-2 ${borderColor} flex-[0_0_auto] box-border touch-none ${visiblity}`}
      style={{
        marginInlineStart: "4px",
        borderStyle: "none solid"
      }}
      {...resizerProps}
    >
      <VisuallyHidden>
        <input ref={ref} type="range" {...inputProps} />
      </VisuallyHidden>
    </div>
  );
}

const _Resizer = React.forwardRef(Resizer) as <T>(
  props: ResizerProps<T> & { ref?: RefObject<HTMLInputElement> }
) => ReactElement;
export { _Resizer as Resizer };
