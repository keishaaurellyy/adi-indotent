import Image from "next/image";
import { cn } from "@/lib/cn";
import { CardTitle } from "@/components/ui";
import type { MediaRef } from "@/lib/categories";

type Props = {
  name: string;
  image: MediaRef | null;
  /**
   * Same card, two frames in the design.
   *
   * `plain` is the photo treatment: a grey card the photo sits inside.
   * `outlined` is for line diagrams on white — they need a white field to sit
   * on and a border to read as a card at all, and they must not be cropped,
   * so they are contained rather than covered.
   */
  frame?: "plain" | "outlined";
  /** Grid-dependent, so the caller owns it. */
  sizes: string;
};

/**
 * The captioned photo tile the category pages use wherever the CMS gives a
 * name and an image — `jenis_roder`, `size_variants` and every equipment
 * group. One component so the three cannot drift apart.
 *
 * The image well keeps its aspect ratio whether or not a photo is attached, so
 * a section that is half-illustrated does not render as ragged rows.
 */
export function PhotoCard({ name, image, frame = "plain", sizes }: Props) {
  const outlined = frame === "outlined";

  return (
    <div
      className={cn(
        "rounded-2xl p-4 lg:p-5",
        outlined ? "border border-border bg-background" : "bg-background-grey"
      )}
    >
      <div
        className={cn(
          "relative aspect-4/3 w-full overflow-hidden rounded-xl",
          !outlined && "bg-grey-40"
        )}
      >
        {image && (
          <Image
            src={image.url}
            alt={image.alt || name}
            fill
            sizes={sizes}
            className={outlined ? "object-contain" : "object-cover"}
          />
        )}
      </div>
      <CardTitle className="mt-5 px-1">{name}</CardTitle>
    </div>
  );
}
