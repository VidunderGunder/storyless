import { type VariantProps, cva } from "class-variance-authority";
import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cn } from "~/styles/utils";
import { Icon } from "@iconify/react";
import { useClipboard } from "@mantine/hooks";

const colorVariants = {
  primary: ["toggle-primary"],
  secondary: ["toggle-secondary"],
  accent: ["toggle-accent"],
  neutral: ["toggle-neutral"],
  info: ["toggle-info"],
  success: ["toggle-success"],
  warning: ["toggle-warning"],
  error: ["toggle-error"],
} as const;
const toggleVariants = cva(["toggle"], {
  variants: {
    color: colorVariants,
  },
});

export type ToggleProps = {
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDelete?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  label?: string;
  disabled?: boolean;
  toggleId?: string;
  ids?: {
    label: string;
    value: string;
    color?: keyof typeof colorVariants;
  }[];
} & Pick<ComponentPropsWithoutRef<"input">, "checked" | "defaultChecked"> &
  Omit<ComponentPropsWithoutRef<"div">, "color" | "onChange"> &
  VariantProps<typeof toggleVariants>;

/**
 * Key props:
 *
 * - `color` - The color of the toggle.
 * - `checked` - Whether the toggle is checked.
 * - `defaultChecked` - The default checked state of the toggle.
 * - `onChange` - The function to call when the toggle is changed.
 * - `label` - The label of the toggle.
 * - `disabled` - Whether the toggle is disabled.
 * - `onDelete` - The function to call when the delete button is clicked.
 * - `ids` - Toggle related IDs for users to copy.
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
 *   ids={[
 *     {
 *       label: "Toggle ID",
 *       value: "toggle-id",
 *       color: "success",
 *     }
 *   ]}
 * />
 * />
 * ```
 */
export const Toggle = forwardRef<HTMLDivElement, ToggleProps>(function Toggle(
  {
    onChange,
    color,
    label,
    checked,
    defaultChecked,
    disabled,
    ids,
    onDelete,
    ...props
  },
  ref,
) {
  const col = "#296392";
  return (
    <div ref={ref} {...props}>
      <div
        className={cn(
          "flex flex-col gap-2 rounded-3xl border border-primary-content bg-base-200 p-2 shadow-lg transition-all delay-100 duration-150",
          checked
            ? "border-blue-950 bg-base-100 [box-shadow:_0px_0px_0px_4px_#51527733]"
            : "border-primary-content [box-shadow:_0px_0px_0px_4px_#51527700]",
        )}
      >
        <div className="flex items-center justify-between ">
          <label className="label flex w-fit cursor-pointer justify-start gap-2">
            <input
              type="checkbox"
              className={cn(
                toggleVariants({
                  color,
                }),
              )}
              defaultChecked={defaultChecked}
              checked={checked}
              disabled={disabled}
              onChange={onChange}
            />
            <span
              className={cn(
                "label-text font-bold text-inherit transition-all delay-100 duration-150",
                checked
                  ? "animate-[pulse_0.325s_ease-in-out] [animation-iteration-count:_1]"
                  : "text-neutral-content opacity-75",
              )}
            >
              {label}
            </span>
          </label>
          <button
            className="btn btn-circle btn-sm"
            disabled={disabled}
            onClick={onDelete}
          >
            <Icon icon="icomoon-free:bin" className="text-red-400" />
          </button>
        </div>
        <div className="flex flex-col">
          {ids?.map((id) => (
            <CopyRow
              key={id.value}
              label={id.label}
              value={id.value}
              color={id.color}
            />
          ))}
        </div>
      </div>
    </div>
  );
});

type CopyRowProps = {
  label: string;
  value: string;
  color?: keyof typeof colorVariants;
} & Omit<ComponentPropsWithoutRef<"button">, "color" | "onClick"> &
  VariantProps<typeof toggleVariants>;
function CopyRow({
  label,
  value,
  color = "accent",
  className,
  ...props
}: CopyRowProps) {
  const { copied, copy } = useClipboard({
    timeout: 2000,
  });

  return (
    <button
      className={cn(
        "btn-sm flex w-full items-center justify-between gap-3 px-0",
        className,
      )}
      onClick={() => {
        copy(value);
      }}
      {...props}
    >
      <span className="pl-[7px] pr-[3px] opacity-75">{label}:</span>
      <div
        className={cn(
          "badge w-full text-xs",
          colorVariants[color],
          copied ? "badge-success" : "badge-secondary",
        )}
      >
        {copied ? "copied!" : value}
      </div>
      <div className="pr-1">
        <span className="btn btn-circle btn-xs flex items-center justify-center">
          {copied ? (
            <Icon icon="fluent:checkmark-circle-16-filled" fontSize={18} />
          ) : (
            <Icon icon="fluent:copy-16-filled" fontSize={18} />
          )}
        </span>
      </div>
    </button>
  );
}
