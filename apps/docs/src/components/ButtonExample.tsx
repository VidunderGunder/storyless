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
  color: "#57799F",
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
  "#42556B": ["bg-[#42556B]", "text-white"],
  "#57799F": ["bg-[#57799F]", "text-white"],
  "#43577E": ["bg-[#43577E]", "text-white"],
  "#313851": ["bg-[#313851]", "text-white"],
  "#D4D195": ["bg-[#D4D195]", "text-black"],
  "#A7C2D1": ["bg-[#A7C2D1]", "text-black"],
} as const;
export const buttonColorKeys = [
  ...Object.keys(buttonColors),
  ...Object.keys(buttonColors),
] as Exclude<ButtonVariantProps["color"], undefined | null>[];

export const button = cva(
  [
    "rounded-full",
    "inline-flex",
    "justify-center",
    "text-center",
    "transition-colors",
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
        true: ["cursor-not-allowed"],
        false: [],
      },
    },
  },
);
