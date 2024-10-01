import type { AriaButtonProps } from "@react-types/button";
import React, { CSSProperties, RefObject } from "react";
import { mergeProps, useButton, useFocusRing } from "react-aria";

interface ButtonProps extends AriaButtonProps {
  isPressed: boolean;
  className?: string;
  style: CSSProperties;
}

export const Button = React.forwardRef(
  (props: ButtonProps, ref: RefObject<HTMLButtonElement>) => {
    let { className, style, ...otherProps } = props;
    let { buttonProps } = useButton(props, ref);

    let { focusProps, isFocusVisible } = useFocusRing();
    let focusRing = isFocusVisible
      ? "outline-2 outline-[orange]"
      : "focus:outline-none";
    return (
      <button
        {...mergeProps(buttonProps, focusProps)}
        ref={ref}
        style={style}
        className={`outline-none text-black text-sm font-semibold py-.5 px-1 cursor-default transition bg-transparent ${focusRing} ${className}`}
      >
        {otherProps.children}
      </button>
    );
  }
);
