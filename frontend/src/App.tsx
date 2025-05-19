import { Route, Routes } from 'react-router-dom'
import Main from './pages/Main';
import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing';
import CardContent from './pages/CardContent';
import Test from './pages/Test';
import { Toaster } from 'react-hot-toast';
import SharePage from './pages/SharePage';

function App() {
  return (
    <>
      <Routes>
        <Route path='/'>
          <Route index element={<Landing />} />
          <Route path='/app' element={<Main />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/contents' element={<CardContent />} />
          <Route path='/test' element={<Test />} />
          <Route path="/brain/:shareLink" element={<SharePage />} />
        </Route>
      </Routes>
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
    </>
  );
}

export default App;
