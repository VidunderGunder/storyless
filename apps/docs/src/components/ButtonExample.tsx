import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "~/styles/utils";
import type { StrictIntersection } from "types/merge";

export type ButtonVariantProps = VariantProps<typeof button>;
export type ButtonProps = React.ComponentPropsWithoutRef<"button"> &
  ButtonVariantProps;

export const buttonDefaultVariants: StrictIntersection<
  ButtonVariantProps,
  ButtonProps
> = {
  color: "slate",
  size: "lg",
};

export function Button({
  className,
  color,
  size,
  children,
  square,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        button({
          ...buttonDefaultVariants,
          color,
          size,
          square,
          disabled,
          className,
        }),
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

export const buttonColors = {
  slate: ["bg-slate-700", "text-white"],
  emerald: ["bg-emerald-600", "text-white"],
  sky: ["bg-sky-600", "text-white"],
  rose: ["bg-rose-600", "text-white"],
} as const;
export const buttonColorKeys = [...Object.keys(buttonColors)] as Exclude<
  ButtonVariantProps["color"],
  undefined | null
>[];

export const button = cva(
  [
    "rounded-full",
    "inline-flex",
    "justify-center",
    "text-center",
    "transition-colors",
    "hover:[box-shadow:_0_0_0_3px_rgba(255,_255,_255,_0.2)]",
    "active:[box-shadow:_0_0_0_3px_rgba(255,_255,_255,_0.1)]",
  ],
  {
    variants: {
      color: buttonColors,
      size: {
        sm: ["min-w-20", "h-full", "min-h-10", "text-sm", "py-1.5", "px-4"],
        lg: ["min-w-32", "h-full", "min-h-12", "text-lg", "py-2.5", "px-7"],
      },
      square: { true: ["rounded", "py-1", "px-5"], false: [] },
      disabled: {
        true: [
          "cursor-not-allowed",
          "hover:bg-gray-400",
          "hover:text-gray-500",
          "bg-gray-300",
          "text-gray-500",
          "hover:[box-shadow:_0_0_0_3px_rgba(255,_255,_255,_0)]",
          "active:[box-shadow:_0_0_0_3px_rgba(255,_255,_255,_0)]",
        ],
        false: [],
      },
    },
  },
);
