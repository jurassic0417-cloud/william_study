import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

/** 萬一某個地方出錯，至少不要整個網站變白畫面 */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('畫面發生錯誤', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="center-screen">
          <div className="notice-card">
            <h2>畫面暫時無法顯示</h2>
            <p>請重新整理頁面試試看。如果還是不行，稍後再回來看看。</p>
            <button className="btn" onClick={() => window.location.reload()}>
              重新整理
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
