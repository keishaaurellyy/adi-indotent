import { Container, Section, SectionHeading } from "@/components/ui";

type SectionShellProps = {
  title: string;
  description?: string | null;
  /**
   * Kept for sections that want their own band. The category pages leave it
   * default: their cards are grey, so a grey section would swallow them.
   */
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
          // SectionHeading caps a left-aligned description at max-w-2xl, which
          // is right for a standfirst under a centred title but wrong here:
          // the only category section with a description is Flooring Modul,
          // and the design runs that paragraph the full width of the grid
          // below it. Inline, so it beats the class.
          descriptionMaxWidth="none"
        />
        {children}
      </Container>
    </Section>
  );
}
