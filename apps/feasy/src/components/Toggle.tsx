import { type VariantProps, cva } from "class-variance-authority";
import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cn } from "~/styles/utils";
import { Icon } from "@iconify/react";
import { useClipboard } from "@mantine/hooks";

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
  toggleId?: string;
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
 * - `onDelete` - The function to call when the delete button is clicked.
 * - `toggleId` - The ID of the toggle.
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
 *   onDelete={handleDelete}
 *   toggleId="world-peace"
 * />
 * ```
 */
export const Toggle = forwardRef<HTMLDivElement, ToggleProps>(function Toggle(
  {
    onChange,
    toggleId,
    color,
    label,
    checked = false,
    disabled,
    onDelete,
    ...props
  },
  ref,
) {
  const { copied, copy } = useClipboard({
    timeout: 3000,
  });

  return (
    <div ref={ref} {...props}>
      <div className="flex flex-col gap-2 rounded-3xl border border-primary-content p-2 shadow-lg">
        <div className="flex items-center justify-between ">
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
        <button
          className="btn-sm flex w-full items-center justify-between gap-3 px-0"
          onClick={() => {
            copy(toggleId);
          }}
        >
          <span className="pl-[7px] pr-[3px] opacity-75">ID:</span>
          <div
            className={cn(
              "badge badge-secondary w-full text-xs",
              copied ? "badge-success" : "badge-secondary",
            )}
          >
            {copied ? "copied!" : toggleId}
          </div>
          <span className="btn btn-circle btn-sm">
            {copied ? (
              <Icon icon="fluent:checkmark-circle-16-filled" fontSize={20} />
            ) : (
              <Icon icon="fluent:copy-16-filled" fontSize={20} />
            )}
          </span>
        </button>
      </div>
    </div>
  );
});
