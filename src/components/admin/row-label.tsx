'use client';

import { useRowLabel } from '@payloadcms/ui';

/**
 * Title for a collapsed array row.
 *
 * Payload labels rows by position — "Item 01", "Item 02" — which is no help on
 * the category pages, where a single global holds eight arrays and an editor
 * looking for one FAQ has to open rows until they find it. This shows what the
 * row actually says instead.
 *
 * The keys below are tried in order and the first one holding text wins. They
 * cover every array in this project: `name` (use cases, wall options, size
 * variants, equipment), `question` (FAQ), `label` (specifications),
 * `group_name` (equipment groups) and `description` (what-you-get, which has
 * no shorter field). Arrays whose rows are nothing but an image have no text
 * to show, so they keep Payload's numbered default rather than using this.
 */
const TITLE_KEYS = ['name', 'question', 'label', 'group_name', 'title', 'description'] as const;

/** Long values are cut here so one row cannot push the collapse toggle off screen. */
const MAX_LENGTH = 70;

export function RowLabel() {
  const { data, rowNumber } = useRowLabel<Record<string, unknown>>();

  const value = TITLE_KEYS.map((key) => data?.[key]).find(
    (candidate): candidate is string => typeof candidate === 'string' && candidate.trim() !== ''
  );

  // A row the editor has not filled in yet still needs a handle to grab.
  if (!value) {
    return <span>{`Row ${String((rowNumber ?? 0) + 1).padStart(2, '0')}`}</span>;
  }

  const text = value.trim();
  return <span>{text.length > MAX_LENGTH ? `${text.slice(0, MAX_LENGTH)}…` : text}</span>;
}
