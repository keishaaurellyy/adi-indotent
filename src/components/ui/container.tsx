import { cn } from "@/lib/cn";

type ContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  size?: "sm" | "md" | "lg" | "xl";
};

const sizes = {
  sm: "max-w-3xl",
  md: "max-w-5xl",
  // 1304px = Figma's 1240px content width + the 32px gutters, so a
  // 1440 frame lands on 100px side margins exactly.
  lg: "max-w-[81.5rem]",
  // 1376px = the 1312px content width used by the wider sections + gutters.
  xl: "max-w-[86rem]",
};

export function Container({
  size = "lg",
  className,
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn("mx-auto w-full px-6 lg:px-8", sizes[size], className)}
      {...props}
    />
  );
}
