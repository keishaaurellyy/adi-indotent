import { Container, Section, SectionHeading } from "@/components/ui";

type SectionShellProps = {
  title: string;
  description?: string | null;
  /** Alternates the background so consecutive sections read as separate bands. */
  tone?: "default" | "muted";
  children: React.ReactNode;
};

/**
 * The frame every category section shares: padding, container width, and the
 * `group_name` heading above the content.
 *
 * Sections are only ever handed to this component once they are known to be
 * non-empty — `lib/categories.ts` drops empty ones while normalising — so
 * there is no empty state to handle here.
 */
export function SectionShell({
  title,
  description,
  tone = "default",
  children,
}: SectionShellProps) {
  return (
    <Section tone={tone}>
      <Container size="lg">
        <SectionHeading
          title={title}
          description={description ?? undefined}
          align="center"
        />
        {children}
      </Container>
    </Section>
  );
}
