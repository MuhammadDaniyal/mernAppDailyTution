import { createBrowserRouter, RouterProvider } from 'react-router-dom'

/** import all components */
import Username from './components/Username'
import Password from './components/Password'
import Profile from './components/Profile'
import Register from './components/Register'
import Recovery from './components/Recovery'
import ResetPassword from './components/ResetPassword'
import PageNotFound from './components/PageNotFound'
import { AuthorizeUser, ProtectPasswordRoute } from './middleware/auth'

/** Root Routes */
const router = createBrowserRouter([
  {
    path: '/',
    element: <Username />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/password',
    element: <ProtectPasswordRoute><Password /></ProtectPasswordRoute>
  },
  {
    path: '/profile',
    element: <AuthorizeUser><Profile /></AuthorizeUser>
  },
  {
    path: '/recovery',
    element: <Recovery />
  },
  {
    path: '/reset-password',
    element: <ResetPassword />
  },
  {
    path: '*',
    element: <PageNotFound />
  },
])

function App() {
  return (
    <main>
      <RouterProvider router={router} />
    </main>
  );
}

export default App;
