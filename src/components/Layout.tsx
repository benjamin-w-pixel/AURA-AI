import React from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import styles from './Layout.module.css';

interface LayoutProps {
  children: React.ReactNode;
  onNavigate: (id: string) => void;
  activePage: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, onNavigate, activePage }) => {
  return (
    <div className={styles.layout}>
      <Sidebar onNavigate={onNavigate} activePage={activePage} />
      <div className={styles.mainContent}>
        <TopBar />
        <main className={styles.pageContent}>
          {children}
        </main>
      </div>
    </div>
  );
};
