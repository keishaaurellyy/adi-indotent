import type { DefaultServerCellComponentProps } from 'payload';

const BYTES_PER_MB = 1024 * 1024;

/**
 * File size in the Media Library list, in megabytes.
 *
 * Payload stores `filesize` in bytes and shows it that way, which is hard to
 * read at a glance for photos and videos. Anything under 0.01 MB is shown as
 * such rather than rounding to "0.00".
 */
export function FileSizeCell({ cellData }: DefaultServerCellComponentProps) {
  if (typeof cellData !== 'number') return <span>—</span>;

  const mb = cellData / BYTES_PER_MB;
  return <span>{mb < 0.01 ? '< 0.01 MB' : `${mb.toFixed(2)} MB`}</span>;
}
