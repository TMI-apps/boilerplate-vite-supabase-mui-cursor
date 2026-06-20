import MuiButton, { type ButtonProps as MuiButtonProps } from "@mui/material/Button";

export interface ButtonProps extends MuiButtonProps {
  // Add any custom props here if needed
}

export const Button = ({ children, ...props }: ButtonProps) => {
  return <MuiButton {...props}>{children}</MuiButton>;
};
