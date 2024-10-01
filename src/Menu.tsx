import type { AriaMenuProps, MenuTriggerProps } from "@react-types/menu";
import type { KeyboardEvent, Node } from "@react-types/shared";
import React, {
  CSSProperties,
  ReactElement,
  ReactNode,
  RefObject,
  useRef,
} from "react";
import { TreeState, useMenuTriggerState, useTreeState } from "react-stately";
import { mergeProps, useMenu, useMenuItem, useMenuTrigger } from "react-aria";
import { Button } from "./Button";
import { Popover } from "./Popover";

interface MenuTriggerComponentProps<T>
  extends AriaMenuProps<T>,
    MenuTriggerProps {
  label: ReactNode;
  style?: CSSProperties;
  className?: string;
}

function MenuTrigger<T extends object>(
  props: MenuTriggerComponentProps<T>,
  ref: RefObject<HTMLButtonElement>
) {
  let { style, className, ...otherProps } = props;
  // Create state based on the incoming props
  let state = useMenuTriggerState(otherProps);

  // Get props for the menu trigger and menu elements
  let { menuTriggerProps, menuProps } = useMenuTrigger<T>({}, state, ref);

  // Continue propagation of keydown event so that the left/right
  // arrow key presses properly bubble to the table (useSelectableCollection)
  let onKeyDown = (e: KeyboardEvent) => e.continuePropagation();
  return (
    <>
      <Button
        {...mergeProps(menuTriggerProps, { onKeyDown })}
        style={style}
        className={className}
        isPressed={state.isOpen}
        ref={ref}
      >
        {props.label}
      </Button>
      {state.isOpen && (
        <Popover state={state} triggerRef={ref} placement="bottom start">
          <Menu
            {...menuProps}
            {...otherProps}
            autoFocus={state.focusStrategy || true}
            onClose={() => state.close()}
          />
        </Popover>
      )}
    </>
  );
}

const _MenuTrigger = React.forwardRef(MenuTrigger) as <T>(
  props: MenuTriggerComponentProps<T> & { ref?: RefObject<HTMLButtonElement> }
) => ReactElement;
export { _MenuTrigger as MenuTrigger };

interface MenuProps<T extends object> extends AriaMenuProps<T> {
  onClose: () => void;
}

function Menu<T extends object>(props: MenuProps<T>) {
  // Create state based on the incoming props
  let state = useTreeState(props);

  // Get props for the menu element
  let ref = useRef();
  let { menuProps } = useMenu(props, state, ref);

  return (
    <ul
      {...menuProps}
      ref={ref}
      className="pt-1 pb-1 shadow-xs rounded-md min-w-[200px] focus:outline-none"
    >
      {[...state.collection].map((item) => (
        <MenuItem key={item.key} item={item} state={state} />
      ))}
    </ul>
  );
}

interface MenuItemProps<T> {
  item: Node<T>;
  state: TreeState<T>;
}

function MenuItem<T>({ item, state }: MenuItemProps<T>) {
  // Get props for the menu item element
  let ref = React.useRef();
  let { menuItemProps } = useMenuItem(
    {
      key: item.key,
    },
    state,
    ref
  );

  // Handle focus events so we can apply highlighted
  // style to the focused menu item
  let isFocused = state.selectionManager.focusedKey === item.key;
  let focusBg = item.key === "delete" ? "bg-red-500" : "bg-blue-500";
  let focus = isFocused ? `${focusBg} text-white` : "text-gray-900";

  return (
    <li
      {...menuItemProps}
      ref={ref}
      className={`${focus} text-sm cursor-default select-none relative mx-1 rounded py-2 pl-3 pr-9 focus:outline-none`}
    >
      {item.rendered}
    </li>
  );
}
