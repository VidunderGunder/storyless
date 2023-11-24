import { type VariantProps, cva } from "class-variance-authority";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  useEffect,
  useRef,
} from "react";
import { cn } from "~/styles/utils";
import { api } from "~/utils/api";
import { Icon } from "@iconify/react";

const toggleVariants = cva(["toggle"], {
  variants: {
    color: {
      primary: ["toggle-primary"],
      secondary: ["toggle-secondary"],
      accent: ["toggle-accent"],
      neutral: ["toggle-neutral"],
      info: ["toggle-info"],
      success: ["toggle-success"],
      warning: ["toggle-warning"],
      error: ["toggle-error"],
    },
  },
});

export type ToggleProps = {
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDelete?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  label?: string;
  disabled?: boolean;
  checked?: boolean;
} & Omit<ComponentPropsWithoutRef<"div">, "color" | "onChange"> &
  VariantProps<typeof toggleVariants>;

/**
 * Key props:
 *
 * - `color` - The color of the toggle.
 * - `checked` - Whether the toggle is checked.
 * - `onChange` - The function to call when the toggle is changed.
 * - `label` - The label of the toggle.
 * - `disabled` - Whether the toggle is disabled.
 *
 * @example
 *
 * ```tsx
 * <Toggle
 *   color="success"
 *   checked={true}
 *   onChange={beTheChangeYouWishToSeeInTheWorld}
 *   label="World Peace 🕊️"
 *   disabled={false}
 * />
 * ```
 */
export const Toggle = forwardRef<HTMLDivElement, ToggleProps>(function ToggleUI(
  { onChange, color, label, checked = false, disabled, onDelete, ...props },
  ref,
) {
  return (
    <div ref={ref} {...props}>
      <div className="flex items-center justify-between">
        <label className="label flex w-fit cursor-pointer justify-start gap-2">
          <input
            type="checkbox"
            className={cn(
              toggleVariants({
                color,
              }),
            )}
            checked={checked}
            disabled={disabled}
            onChange={onChange}
          />
          <span className="label-text">{label}</span>
        </label>
        <button className="btn btn-circle btn-sm" onClick={onDelete}>
          <Icon icon="icomoon-free:bin" className="text-red-400" />
        </button>
      </div>
    </div>
  );
});
