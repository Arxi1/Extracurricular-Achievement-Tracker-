import { RouterProvider } from 'react-router';
import { AuthProvider } from './context/AuthContext';
import { AchievementProvider } from './context/AchievementContext';
import { Toaster } from './components/ui/sonner';
import { router } from './routes';

export default function App() {
    return (
        <AuthProvider>
            <AchievementProvider>
                <RouterProvider router={router} />
                <Toaster />
            </AchievementProvider>
        </AuthProvider>
    );
}
