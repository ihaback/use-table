import React, { CSSProperties, useRef } from "react";
import { useCheckbox } from "react-aria";
import { useToggleState } from "react-stately";
import type { AriaCheckboxProps } from "@react-aria/checkbox";

interface CheckboxProps extends AriaCheckboxProps {
  style?: CSSProperties;
  className?: string;
}

export function Checkbox(props: CheckboxProps) {
  let { style, className, ...otherProps } = props;
  let ref = useRef();
  let state = useToggleState(otherProps);
  let { inputProps } = useCheckbox(otherProps, state, ref);
  return (
    <input {...inputProps} ref={ref} style={style} className={className} />
  );
}
