import logo from '../../../web/assets/images/logo/xuyu_logo.png';
import './App.css';

const LOCAL_WEB_URL = 'http://localhost:11011/';

export default function App() {
  const enterApp = () => {
    window.electron.ipcRenderer.sendMessage('selectServer', {
      url: LOCAL_WEB_URL,
    });
  };

  return (
    <main className="entry-shell">
      <section className="entry-panel" aria-label="序语空间桌面端">
        <img className="entry-logo" src={logo} alt="序语空间" />

        <div className="entry-copy">
          <p className="entry-kicker">XUYU SPACE DESKTOP</p>
          <h1>序语空间</h1>
          <p className="entry-subtitle">进入本地开发版本</p>
        </div>

        <button className="entry-button" type="button" onClick={enterApp}>
          进入序语空间
        </button>
      </section>
    </main>
  );
}
