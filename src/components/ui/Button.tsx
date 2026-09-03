import type { ButtonHTMLAttributes } from "react";
import { buttonStyles, type ButtonSize, type ButtonVariant } from "@/components/ui/buttonStyles";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  testId?: string;
};

export default function Button({
  variant,
  size,
  className,
  testId,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      data-testid={testId}
      className={buttonStyles({ variant, size, className })}
      {...rest}
    />
  );
}
