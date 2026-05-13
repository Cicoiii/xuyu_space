import React, { PropsWithChildren } from 'react';
import { useGroupPanelInfo } from 'tailchat-shared';
import {
  CommonPanelWrapper,
  CommonPanelWrapperProps,
} from '../../common/Wrapper';
import _isNil from 'lodash/isNil';

interface GroupPanelWithHeader extends PropsWithChildren {
  groupId: string;
  panelId: string;

  prefixActions?: CommonPanelWrapperProps['actions'];
  suffixActions?: CommonPanelWrapperProps['actions'];
}
export const GroupPanelContainer: React.FC<GroupPanelWithHeader> = React.memo(
  (props) => {
    const { groupId, panelId } = props;
    const panelInfo = useGroupPanelInfo(groupId, panelId);

    if (_isNil(panelInfo)) {
      return null;
    }

    return (
      <CommonPanelWrapper
        header={panelInfo.name}
        actions={(ctx) => [
          ...(props.prefixActions?.(ctx) ?? []),
          ...(props.suffixActions?.(ctx) ?? []),
        ]}
      >
        {props.children}
      </CommonPanelWrapper>
    );
  }
);
GroupPanelContainer.displayName = 'GroupPanelWithHeader';
