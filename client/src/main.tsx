
import { createRoot } from 'react-dom/client'
import './index.css'
import RoomPage from './pages/RoomPage.tsx'
import LobbyPage from './pages/LobbyPage.tsx'

import { createBrowserRouter,createRoutesFromElements,RouterProvider,Route } from 'react-router-dom'
import SocketProvider from './context/SocketProvider.tsx'
import PeerProvider from './context/PeerProvider.tsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/'>
      <Route index element={<LobbyPage/>}></Route>
      <Route path='/room/:roomid' element={<RoomPage/>}></Route>
    </Route>
  )
)

createRoot(document.getElementById('root')!).render(
  <SocketProvider>
    <PeerProvider>
    <RouterProvider router={router}/>
    </PeerProvider>
  </SocketProvider>
)
