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

/**
 * The events rail is CMS-driven, so the page is rebuilt on a timer rather
 * than pinned to whatever the database held at deploy time. Five minutes is
 * short enough that an editor sees their change without a redeploy.
 */
export const revalidate = 300;

export default async function Home() {
  const events = await getHomeEvents();

  return (
    <>
      <Navbar />

      {/* Figma: 375x600 on mobile, 1440x800 from lg up. */}
      <section className="relative flex min-h-[37.5rem] items-center justify-center overflow-hidden bg-background-dark lg:min-h-[50rem]">
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
        {/*
          landing-bg.png is not opaque — its alpha runs 78-95%, because Figma
          exported the photo together with the dark layer over it. It needs a
          dark surface to composite onto; over the white body it washes out,
          which is what bg-background-dark on the section is for. No extra
          scrim element: the darkening is already in the asset.
        */}
        <Container size="md" className="relative py-24 text-center">
          {/* Figma: Font/size/4xl, Semibold 600, 120%, capitalize */}
          <h1 className="text-h1 font-semibold capitalize text-foreground-light">
            Sewa Tenda
            <br />
            Wujudkan Acara Sukses
          </h1>
          {/* Figma: Font/size/md, Regular 400, 150% */}
          <p className="mx-auto mt-6 max-w-xl text-body-xl font-normal text-foreground-light">
            Sewa tenda berkualitas dengan pemasangan cepat dan rapi untuk setiap
            jenis acara, dari skala kecil hingga besar
          </p>
          {/* Full-bleed within the gutter on mobile; content-width from sm up. */}
          <div className="mt-10">
            <Button href="/events" variant="secondary" className="w-full sm:w-auto">
              Lihat proyek kami
            </Button>
          </div>
        </Container>
      </section>

      <ProductCollection />
      <TrustedSolution />
      <HandledEvents events={events} />
      <WhyChooseUs />
      <SiteFooter />
    </>
  );
}
