"use client";

import { cva, type VariantProps } from "class-variance-authority";
import {
  Button as AriaButton,
  type ButtonProps as AriaButtonProps,
  composeRenderProps,
} from "react-aria-components";

import { cn } from "@/lib/utils/ui";

const buttonVariants = cva(
  [
    "inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors",
    /* Disabled */
    "data-[disabled]:pointer-events-none data-[disabled]:opacity-50 ",
    /* Focus Visible */
    "data-[focus-visible]:outline-none data-[focus-visible]:ring-2 data-[focus-visible]:ring-ring data-[focus-visible]:ring-offset-2",
    /* Resets */
    "focus-visible:outline-none",
  ],
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground data-[hovered]:bg-primary/90",
        destructive:
          "border-red-600 border-2 text-red-600 data-[hovered]:border-red-800 data-[hovered]:text-red-800",
        outline:
          "border border-input bg-background data-[hovered]:bg-accent data-[hovered]:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground data-[hovered]:bg-secondary/80",
        ghost: "data-[hovered]:bg-accent data-[hovered]:text-accent-foreground",
        link: "text-primary underline-offset-4 data-[hovered]:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "size-10",
        fit: "siz-fit p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

interface ButtonProps
  extends AriaButtonProps,
    VariantProps<typeof buttonVariants> {}

const Button = ({ className, variant, size, ...props }: ButtonProps) => {
  return (
    <AriaButton
      className={composeRenderProps(className, (className) =>
        cn(
          buttonVariants({
            variant,
            size,
            className,
          }),
        ),
      )}
      {...props}
    />
  );
};

export { Button, buttonVariants };
export type { ButtonProps };
