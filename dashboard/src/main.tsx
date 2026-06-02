import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import MarketsScreen from './pages/markets/views/MarketsScreen.tsx'
import MarketScreen from './pages/markets/views/MarketScreen.tsx'
import SellerScreen from './pages/markets/views/SellerScreen.tsx'
import { Provider } from 'react-redux'
import { store } from './redux/api/store.ts'
import OrdersScreen from './pages/orders/views/OrdersScreen.tsx'
import OrderScreen from './pages/orders/views/OrderScreen.tsx'
import GiftCardsScreen from './pages/giftcards/views/GiftCardsScreen.tsx'
import PromoCodesScreen from './pages/promocodes/views/PromoCodesScreen.tsx'
import { API_URL } from './config'
import AgentsScreen from './pages/agents/views/AgentsScreen.tsx'
import ShippersScreen from './pages/shippers/views/ShippersScreen.tsx'
import AgentScreen from './pages/agents/views/AgentScreen.tsx'
import ShipperScreen from './pages/shippers/views/ShipperScreen.tsx'
import UsersScreen from './pages/users/views/UsersScreen.tsx'
import UserScreen from './pages/users/views/UserScreen.tsx'
import LoginPage from './pages/auth/login'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Toaster } from 'sonner'

if (import.meta.env.DEV) {
    console.log('API URL:', API_URL)
}

const router = createBrowserRouter([
    {
        path: '/login',
        element: <LoginPage />,
    },
    {
        path: '/',
        element: <ProtectedRoute><App /></ProtectedRoute>,
        children: [
            {
                path: '/',
                element: <MarketsScreen />,
            },
            {
                path: '/markets',
                element: <MarketsScreen />,
            },
            {
                path: '/markets/:marketId',
                element: <MarketScreen />,
            },
            {
                path: '/sellers/:sellerId',
                element: <SellerScreen />,
            },
            {
                path: '/orders',
                element: <OrdersScreen />,
            },
            {
                path: '/orders/:orderId',
                element: <OrderScreen />,
            },
            {
                path: '/cards',
                element: <ProtectedRoute restrictedForAreaAdmin><GiftCardsScreen /></ProtectedRoute>,
            },
            {
                path: '/promo-codes',
                element: <ProtectedRoute restrictedForAreaAdmin><PromoCodesScreen /></ProtectedRoute>,
            },
            {
                path: '/agents',
                element: <AgentsScreen />,
            },
            {
                path: '/agents/:agentId',
                element: <AgentScreen />,
            },
            {
                path: '/shippers',
                element: <ProtectedRoute restrictedForAreaAdmin><ShippersScreen /></ProtectedRoute>,
            },
            {
                path: '/shippers/:shipperId',
                element: <ProtectedRoute restrictedForAreaAdmin><ShipperScreen /></ProtectedRoute>,
            },
            {
                path: '/users',
                element:  <ProtectedRoute restrictedForAreaAdmin><UsersScreen /></ProtectedRoute>,
            },
            {
                path: '/users/:userId',
                element:    <ProtectedRoute restrictedForAreaAdmin><UserScreen /></ProtectedRoute>,
            }
        ],
    },
])

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Provider store={store}>
            <Toaster richColors position="top-center" />
            <RouterProvider router={router} />
        </Provider>
    </StrictMode>
)
