"use client";

import { Component, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Rendered instead of the children if they throw (e.g. WebGL fails). */
  fallback?: ReactNode;
};

type State = { hasError: boolean };

/**
 * Catches render-time errors from its subtree so a single failing component
 * (e.g. a WebGL canvas that can't get a context) degrades gracefully instead
 * of taking down the whole page.
 */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) return this.props.fallback ?? null;
    return this.props.children;
  }
}
