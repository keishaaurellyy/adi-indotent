import Image from "next/image";
import { Button, Container } from "@/components/ui";
import { Navbar } from "@/components/layout/navbar";
import { ProductCollection } from "@/components/sections/product-collection";
import { TrustedSolution } from "@/components/sections/trusted-solution";
import { HandledEvents } from "@/components/sections/handled-events";
import { WhyChooseUs } from "@/components/sections/why-choose-us";
import { SiteFooter } from "@/components/layout/site-footer";
import landingBg from "@/assets/landing-bg.png";
import { getHomeEvents } from "@/lib/events";
import { getProducts } from "@/lib/products";
import { openGraphBase } from "@/lib/metadata";
import { SITE_DESCRIPTION, SITE_TITLE } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: {
    ...openGraphBase,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: "/",
  },
};

/**
 * The product cards and events rail are CMS-driven, so the page is rebuilt on
 * a timer rather than pinned to whatever the database held at deploy time.
 * Five minutes is short enough that an editor sees their change without a
 * redeploy.
 */
export const revalidate = 300;

export default async function Home() {
  // Two independent reads; awaiting them in sequence would stack their
  // latency onto the render for no reason.
  const [products, events] = await Promise.all([
    getProducts(),
    getHomeEvents(),
  ]);

  return (
    <>
      <Navbar />

      {/* Figma: 375x600 on mobile, 1440x800 from lg up. */}
      <section className="relative flex min-h-150 items-center justify-center overflow-hidden bg-background-dark lg:min-h-200">
        <Image
          src={landingBg}
          alt=""
          fill
          sizes="100vw"
          placeholder="blur"
          quality={90}
          preload
          className="object-cover"
        />
        <Container size="md" className="relative py-24 text-center">
          <h1 className="rise-in text-h1 font-semibold capitalize text-foreground-light">
            Sewa Tenda
            <br />
            Wujudkan Acara Sukses
          </h1>
          <p className="rise-in mx-auto mt-6 max-w-xl text-body-xl font-normal text-foreground-light [--rise-delay:100ms]">
            Sewa tenda berkualitas dengan pemasangan cepat dan rapi untuk setiap
            jenis acara, dari skala kecil hingga besar
          </p>
          <div className="rise-in mt-10 [--rise-delay:200ms]">
            <Button href="/events" variant="secondary" className="w-full sm:w-auto">
              Lihat proyek kami
            </Button>
          </div>
        </Container>
      </section>

      <ProductCollection items={products} />
      <TrustedSolution />
      <HandledEvents events={events} />
      <WhyChooseUs />
      <SiteFooter />
    </>
  );
}
