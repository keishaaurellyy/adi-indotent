/**
 * Hides the tabs along the top of a document in the admin: Edit, Versions and
 * (via `hideAPIURL`) API.
 *
 * Edit is the form the editor is already on, and once the other two are gone it
 * is the only tab left, so it does nothing. Draft/Publish are unaffected; they
 * live in the document controls, not the tabs.
 *
 * Payload merges each `tab` over its built-in one, so the views themselves
 * still resolve at their usual routes.
 */
export const hideDocTabs = {
  views: {
    edit: {
      default: { tab: { condition: () => false } },
      versions: { tab: { condition: () => false } },
    },
  },
};
