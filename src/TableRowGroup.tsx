import React, { CSSProperties, ElementType, ReactNode } from "react";
import { useTableRowGroup } from "react-aria";

interface TableRowGroupProps {
  type: ElementType;
  style?: CSSProperties;
  children: ReactNode;
  onScroll?: () => void;
  className?: string;
}

export const TableRowGroup = React.forwardRef(
  (props: TableRowGroupProps, ref) => {
    let { type: Element, style, children, onScroll, className } = props;
    let { rowGroupProps } = useTableRowGroup();
    return (
      <Element
        {...rowGroupProps}
        onScroll={onScroll}
        style={style}
        className={className}
        ref={ref}
      >
        {children}
      </Element>
    );
  }
);
