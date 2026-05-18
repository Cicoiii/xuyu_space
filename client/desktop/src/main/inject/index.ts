import { app } from 'electron';

/**
 * 生成注入到Webview中的js代码
 */
export function generateInstallPluginScript() {
  /**
   * Keep the legacy Tailchat plugin protocol name for web client compatibility.
   */
  const inner = `function main() {
    window.tailchat
      .installPlugin({
        label: 'Xuyu Space Desktop Support',
        'label.zh-CN': '序语空间桌面端支持',
        name: 'com.msgbyte.env.electron',
        url: '/plugins/com.msgbyte.env.electron/index.js',
        version: '0.0.0',
        author: 'moonrailgun',
        description: 'Add support for the Xuyu Space desktop environment',
        'description.zh-CN': '为序语空间添加桌面端环境支持',
        requireRestart: true,
      });
  }`;

  const raw = `(${inner})()`;
  return raw;
}

export function generateInjectedScript(): string {
  return [generateDeviceInfo()].join(';');
}

function getPlatform() {
  if (process.platform === 'darwin') {
    return 'mac';
  } else if (process.platform === 'win32') {
    return 'windows';
  } else if (process.platform === 'linux') {
    return 'linux';
  } else {
    return process.platform;
  }
}

function generateDeviceInfo() {
  return `window.__electronDeviceInfo = { version: "${app.getVersion()}", name: "${app.getName()}", platform: "${getPlatform()}" }`;
}
