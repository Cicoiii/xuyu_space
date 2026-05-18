import { ErrorBoundary } from '@/components/ErrorBoundary';
import {
  useRecordQuickSwitcherVisitedAction,
  useUserSessionPreference,
} from '@/hooks/useUserPreference';
import { pluginCustomPanel } from '@/plugin/common';
import React, { useEffect } from 'react';
import { useLocation } from 'react-router';
import { Navigate, Route, Routes } from 'react-router-dom';
import { PageContent } from '../PageContent';
import { PersonalConverse } from './Converse';
import { FriendPanel } from './Friends';
import { PluginsPanel } from './Plugins';
import { PersonalSidebar } from './Sidebar';
import { useGlobalConfigStore } from 'tailchat-shared';
import { QUICK_SWITCHER_ACTION_KEYS } from '@/components/QuickSwitcher/actionKeys';

export const Personal: React.FC = React.memo(() => {
  const [lastVisitPanelUrl, setLastVisitPanelUrl] = useUserSessionPreference(
    'personLastVisitPanelUrl'
  );
  const location = useLocation();
  const disablePluginStore = useGlobalConfigStore(
    (state) => state.disablePluginStore
  );
  const recordQuickSwitcherVisitedAction =
    useRecordQuickSwitcherVisitedAction();

  useEffect(() => {
    setLastVisitPanelUrl(location.pathname);

    const personalCustomPrefix = '/main/personal/custom/';
    if (location.pathname === '/main/personal/friends') {
      recordQuickSwitcherVisitedAction(QUICK_SWITCHER_ACTION_KEYS.personal);
    } else if (location.pathname === '/main/personal/plugins') {
      recordQuickSwitcherVisitedAction(QUICK_SWITCHER_ACTION_KEYS.plugins);
    } else if (location.pathname.startsWith('/main/personal/converse/')) {
      const converseId = location.pathname.split('/').pop();
      if (converseId) {
        recordQuickSwitcherVisitedAction(
          QUICK_SWITCHER_ACTION_KEYS.dmConverse(converseId)
        );
      }
    } else if (location.pathname.startsWith(personalCustomPrefix)) {
      recordQuickSwitcherVisitedAction(
        QUICK_SWITCHER_ACTION_KEYS.personalCustomPanel(
          location.pathname.slice(personalCustomPrefix.length)
        )
      );
    }
  }, [location.pathname]);

  return (
    <PageContent data-tc-role="content-personal" sidebar={<PersonalSidebar />}>
      <Routes>
        <Route path="/friends" element={<FriendPanel />} />
        {!disablePluginStore && (
          <Route path="/plugins" element={<PluginsPanel />} />
        )}
        <Route path="/converse/:converseId" element={<PersonalConverse />} />
        {pluginCustomPanel
          .filter((p) => p.position === 'personal')
          .map((p) => (
            <Route
              key={p.name}
              path={`/custom/${p.name}`}
              element={
                <ErrorBoundary>{React.createElement(p.render)}</ErrorBoundary>
              }
            />
          ))}

        <Route
          path="/"
          element={
            <Navigate
              to={
                lastVisitPanelUrl ? lastVisitPanelUrl : '/main/personal/friends'
              }
            />
          }
        />
      </Routes>
    </PageContent>
  );
});
Personal.displayName = 'Personal';
