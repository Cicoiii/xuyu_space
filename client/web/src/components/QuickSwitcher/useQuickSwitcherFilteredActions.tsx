import _take from 'lodash/take';
import { useMemo } from 'react';
import {
  QuickAction,
  useQuickSwitcherAllActions,
} from './useQuickSwitcherAllAction';
import { useUserSessionPreference } from '@/hooks/useUserPreference';

/**
 * 过滤快速搜索操作
 * 仅获取前5个
 * @param keyword 关键字
 */
export function useQuickSwitcherFilteredActions(
  keyword: string
): QuickAction[] {
  const allActions = useQuickSwitcherAllActions();
  const [visitedActionKeys = []] = useUserSessionPreference(
    'quickSwitcherVisitedActionKeys'
  );

  const filteredActions = useMemo(() => {
    if (keyword === '') {
      return visitedActionKeys
        .map((key) => allActions.find((action) => action.key === key))
        .filter((action): action is QuickAction => Boolean(action));
    }

    return _take(
      allActions.filter((action) => action.label.includes(keyword)),
      5
    );
  }, [keyword, allActions, visitedActionKeys]);

  return filteredActions;
}
