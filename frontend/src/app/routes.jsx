import { createBrowserRouter, Navigate } from 'react-router';
import Login from './components/Login';
import DashboardLayout from './components/DashboardLayout';
import AdminDashboard from './components/AdminDashboard';
import StudentDashboard from './components/StudentDashboard';
import AchievementManagement from './components/AchievementManagement';
import ApprovalQueue from './components/ApprovalQueue';
import Reports from './components/Reports';
import MyAchievements from './components/MyAchievements';
import UploadAchievement from './components/UploadAchievement';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';

// Dashboard Router component to redirect based on role
function DashboardRouter() {
    const { user } = useAuth();

    if (!user) return <Navigate to="/login" replace />;

    if (user.role === 'admin') {
        return <AdminDashboard />;
    } else {
        return <StudentDashboard />;
    }
}

export const router = createBrowserRouter([
    {
        path: '/login',
        Component: Login,
    },
    {
        path: '/',
        element: (
            <ProtectedRoute>
                <DashboardLayout />
            </ProtectedRoute>
        ),
        children: [
            {
                index: true,
                element: <Navigate to="/dashboard" replace />,
            },
            {
                path: 'dashboard',
                Component: DashboardRouter,
            },
            // Admin Routes
            {
                path: 'achievements',
                element: (
                    <ProtectedRoute requiredRole="admin">
                        <AchievementManagement />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'approvals',
                element: (
                    <ProtectedRoute requiredRole="admin">
                        <ApprovalQueue />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'reports',
                element: (
                    <ProtectedRoute requiredRole="admin">
                        <Reports />
                    </ProtectedRoute>
                ),
            },
            // Student Routes
            {
                path: 'my-achievements',
                element: (
                    <ProtectedRoute requiredRole="student">
                        <MyAchievements />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'upload',
                element: (
                    <ProtectedRoute requiredRole="student">
                        <UploadAchievement />
                    </ProtectedRoute>
                ),
            },
        ],
    },
    {
        path: '*',
        element: <Navigate to="/login" replace />,
    },
]);
