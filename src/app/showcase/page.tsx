import { Button, Container, Section } from "@/components/ui";
import { Navbar } from "@/components/layout/navbar";

const variants = ["primary", "secondary", "outline", "ghost"] as const;
const sizes = ["sm", "md", "lg"] as const;

/** Arrow used to check icon + label spacing (the `gap-2` in Button's base). */
function Arrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M3 8h10m0 0-4-4m4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3 border-b border-border py-6 last:border-b-0 sm:flex-row sm:items-center">
      <span className="w-32 shrink-0 text-body-md text-foreground-secondary">
        {label}
      </span>
      <div className="flex flex-wrap items-center gap-4">{children}</div>
    </div>
  );
}

export default function Showcase() {
  return (
    <>
      <Navbar tone="solid" />
      <main>
        <Section>
          <Container size="md">
            <h1 className="text-h2">Button</h1>
            <p className="mt-2 text-body-lg text-foreground-secondary">
              Every variant, size and state. Compare against Figma and tell me
              what&apos;s off.
            </p>

            <h2 className="mt-12 text-h6">Variants &times; sizes</h2>
            <div className="mt-2">
              {variants.map((variant) => (
                <Row key={variant} label={variant}>
                  {sizes.map((size) => (
                    <Button key={size} variant={variant} size={size}>
                      Hubungi Kami
                    </Button>
                  ))}
                </Row>
              ))}
            </div>

            <h2 className="mt-12 text-h6">States</h2>
            <div className="mt-2">
              <Row label="default">
                <Button>Hubungi Kami</Button>
              </Row>
              <Row label="disabled">
                <Button disabled>Hubungi Kami</Button>
                <Button variant="secondary" disabled>
                  Hubungi Kami
                </Button>
                <Button variant="outline" disabled>
                  Hubungi Kami
                </Button>
              </Row>
              <Row label="with icon">
                <Button>
                  Hubungi Kami
                  <Arrow />
                </Button>
                <Button variant="outline">
                  <Arrow />
                  Kembali
                </Button>
              </Row>
              <Row label="icon only">
                <Button aria-label="Next" className="w-11 px-0">
                  <Arrow />
                </Button>
              </Row>
              <Row label="as link">
                <Button href="/">Ke Beranda</Button>
                <Button href="/" variant="outline">
                  Ke Beranda
                </Button>
              </Row>
              <Row label="full width">
                <div className="w-full sm:w-80">
                  <Button className="w-full">Hubungi Kami</Button>
                </div>
              </Row>
            </div>
          </Container>
        </Section>

        {/* Dark sections use background-dark; check contrast holds there. */}
        <section className="bg-background-dark py-16 sm:py-24">
          <Container size="md">
            <h2 className="text-h6 text-foreground-light">On dark background</h2>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              {variants.map((variant) => (
                <Button key={variant} variant={variant}>
                  Hubungi Kami
                </Button>
              ))}
            </div>
          </Container>
        </section>
      </main>
    </>
  );
}
