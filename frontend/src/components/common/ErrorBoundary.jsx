import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 border border-black bg-white max-w-lg mx-auto my-12 font-mono text-xs">
          <div className="border-b border-black pb-2 mb-3">
            <span className="text-[10px] font-bold text-swiss-red uppercase tracking-widest block">
              COMPONENT RENDERING FAULT
            </span>
            <h3 className="font-bold text-black uppercase text-sm mt-1">Application Recovered</h3>
          </div>
          <p className="text-zinc-600 mb-4 font-sans text-xs">
            {this.state.error?.message || 'An unexpected rendering error occurred.'}
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            className="px-4 py-2 bg-black text-white uppercase font-bold text-xs hover:bg-swiss-red transition-colors"
          >
            Reload Module
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
