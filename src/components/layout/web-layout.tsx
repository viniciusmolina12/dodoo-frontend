'use client';

import { WebSidebar } from './web-sidebar';

interface WebLayoutProps {
  active: string;
  onNav?: (id: string) => void;
  onCreate?: () => void;
  children: React.ReactNode;
  rightPanel?: React.ReactNode;
  rightWidth?: number;
}

export function WebLayout({ active, onNav, onCreate, children, rightPanel, rightWidth = 400 }: WebLayoutProps) {
  return (
    <div className="dodoo-app" style={{
      width: '100%', height: '100vh',
      display: 'flex', overflow: 'hidden', background: '#FFF8E7',
    }}>
      <WebSidebar active={active} onNav={onNav} onCreate={onCreate} />
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <div style={{ flex: 1, overflow: 'auto' }}>{children}</div>
        {rightPanel && (
          <div style={{
            width: rightWidth, flexShrink: 0,
            borderLeft: '1.5px solid #EDE7D6',
            background: '#FFFFFF', overflow: 'auto',
          }}>
            {rightPanel}
          </div>
        )}
      </div>
    </div>
  );
}
