export const QUICK_SWITCHER_ACTION_KEYS = {
  personal: 'qs#personal',
  plugins: 'qs#plugins',
  personalCustomPanel: (panelName: string) => `qs#personalcustom#${panelName}`,
  dmConverse: (converseId: string) => `qs#converse#${converseId}`,
  groupPanel: (groupId: string, panelId: string) =>
    `qs#grouppanel#${groupId}#${panelId}`,
};
