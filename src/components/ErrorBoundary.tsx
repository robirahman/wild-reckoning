import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  /** Called after the player chooses to recover (e.g. return to the main menu) */
  onReset: () => void;
}

interface State {
  error: Error | null;
}

/**
 * Catches render errors anywhere below it so a bug shows a recoverable
 * screen instead of unmounting the whole app into a blank page.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Wild Reckoning hit an error:', error, info.componentStack);
  }

  private handleReset = () => {
    this.setState({ error: null });
    this.props.onReset();
  };

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div role="alert" style={{
        maxWidth: 560,
        margin: '80px auto',
        padding: '24px 28px',
        border: '1px solid var(--color-danger)',
        borderRadius: 6,
        background: 'var(--color-panel-bg)',
        fontFamily: 'var(--font-ui)',
      }}>
        <h2 style={{ marginTop: 0 }}>Something went wrong</h2>
        <p style={{ fontFamily: 'var(--font-narrative)', lineHeight: 1.5 }}>
          The game ran into an error and couldn't show this screen. Your last saved game is
          still available from the main menu.
        </p>
        <pre style={{
          whiteSpace: 'pre-wrap',
          fontSize: '0.8rem',
          color: 'var(--color-text-muted)',
          margin: '16px 0',
        }}>
          {this.state.error.message}
        </pre>
        <button
          onClick={this.handleReset}
          style={{
            padding: '8px 20px',
            fontFamily: 'var(--font-ui)',
            fontWeight: 600,
            border: '2px solid var(--color-text)',
            borderRadius: 4,
            background: 'var(--color-panel-bg)',
            cursor: 'pointer',
          }}
        >
          Return to main menu
        </button>
      </div>
    );
  }
}
