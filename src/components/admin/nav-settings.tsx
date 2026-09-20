'use client';

import { PopupList, toast, useAuth, useConfig, useTheme } from '@payloadcms/ui';
import type { Theme } from '@payloadcms/ui';
import { formatAdminURL } from 'payload/shared';

const THEMES = [
  { value: 'auto', label: 'Automatic' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
] as const;

/**
 * Admin theme and "Reset preferences", in the gear menu at the bottom of the
 * sidebar.
 *
 * Payload keeps these in a "Payload Settings" block at the foot of the account
 * page, which nobody scrolls to. The gear menu (`admin.components.settingsMenu`)
 * is where they belong. The language picker is not repeated here: the admin has
 * one language, so it would be a dropdown with a single choice.
 *
 * Resetting asks through the browser's own confirm rather than Payload's modal,
 * because the popup unmounts its contents the moment it closes and would take
 * the modal with it.
 */
export function NavSettings() {
  const { autoMode, setTheme, theme } = useTheme();
  const { user } = useAuth();
  const {
    config: {
      routes: { api: apiRoute },
    },
  } = useConfig();

  // The provider accepts 'auto' (Payload's own toggle passes it) but types only light and dark,
  // hence the cast on setTheme below.
  const current = autoMode ? 'auto' : theme;

  const resetPreferences = async () => {
    if (!user) return;
    if (!window.confirm('Reset your saved admin preferences, such as column choices and collapsed sections?')) return;

    const query = new URLSearchParams({ depth: '0', 'where[user.value][equals]': String(user.id) });
    try {
      const res = await fetch(formatAdminURL({ apiRoute, path: `/payload-preferences?${query}` }), {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        method: 'DELETE',
      });
      const json = await res.json();
      if (res.ok) toast.success(json.message);
      else toast.error(json.message);
    } catch {
      toast.error('Could not reset preferences.');
    }
  };

  return (
    <PopupList.ButtonGroup>
      <PopupList.GroupLabel label="Theme" />
      {THEMES.map(({ value, label }) => (
        <PopupList.Button active={current === value} key={value} onClick={() => setTheme(value as Theme)}>
          {label}
        </PopupList.Button>
      ))}
      <PopupList.Divider />
      <PopupList.Button onClick={resetPreferences}>Reset preferences</PopupList.Button>
    </PopupList.ButtonGroup>
  );
}
