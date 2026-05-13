import { regCustomPanel } from '@capital/common';
import { SidebarIcon } from './ChatPanel';

const PLUGIN_ID = 'com.msgbyte.xiaoxu-chat';

console.log(`Plugin XiaoXu Chat(${PLUGIN_ID}) is loaded`);

regCustomPanel({
  position: 'navbar-group',
  icon: 'mdi:creation',
  name: `${PLUGIN_ID}/chat`,
  label: '小序聊天',
  render: () => null, // 不走路由渲染，浮窗由 SidebarIcon 自行管理
  renderIcon: SidebarIcon,
  onClick: () => {}, // 阻止路由跳转，实际点击由 SidebarIcon 内部处理
});
