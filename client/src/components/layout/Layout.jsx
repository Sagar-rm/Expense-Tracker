import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout() {
    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0b0f' }}>
            <Sidebar />
            <main style={{
                flex: 1,
                marginLeft: '240px',
                padding: '32px',
                maxWidth: '100%',
                overflow: 'auto',
            }}
                className="main-content"
            >
                <Outlet />
            </main>
            <style>{`
        @media (max-width: 768px) {
          .main-content {
            margin-left: 0 !important;
            padding: 80px 16px 24px !important;
          }
        }
      `}</style>
        </div>
    );
}
