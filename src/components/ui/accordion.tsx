import { cn } from "@/lib/cn";

type AccordionItemProps = {
  question: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
};

/**
 * Zero-JS disclosure built on native <details>/<summary> — works in
 * Server Components and needs no client bundle. Suited to FAQ sections.
 */
export function AccordionItem({
  question,
  children,
  defaultOpen,
  className,
}: AccordionItemProps) {
  return (
    <details
      className={cn("group border-b border-border py-4", className)}
      open={defaultOpen}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium [&::-webkit-details-marker]:hidden">
        {question}
        <span
          aria-hidden
          className="text-muted-foreground transition-transform group-open:rotate-45"
        >
          +
        </span>
      </summary>
      <div className="pt-3 text-sm leading-6 text-muted-foreground">
        {children}
      </div>
    </details>
  );
}

export function Accordion({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("divide-y divide-border", className)} {...props} />;
}
