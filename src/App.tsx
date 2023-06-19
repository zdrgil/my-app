import './App.css';
import { Route, Routes } from 'react-router-dom';
import User from './page/User';
import NewPage from './page/NewPage';
import Main from './page/Main';
import Loginpage from './page/Loginpage';
import Newcat from './page/Newcat';
import CatList from './page/CatList';
import PublishUser from './page/PublisUser';
import LoginPublish from './page/LoginPublish';
import Favorites from './page/FavoriteCat'
import MessagePage from './page/MessagePage';
import ReplyMessagePage from './page/ReplyMessagePage';

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Main />} />
        <Route path='/newcode' element={<NewPage />} />
        <Route path='/user' element={<User />} />
        <Route path='/login' element={<Loginpage />} />
        <Route path='/newcat' element={<Newcat />} />
        <Route path='/catslist' element={<CatList />} />
        <Route path='/register/public-users' element={<PublishUser />} />
        <Route path='/login/public-users' element={<LoginPublish />} />
        <Route path='/public-users/favorites' element={<Favorites />} />
        <Route path='/public-users/MessagePage' element={<MessagePage />} />
        <Route path='/user/ReplyMessagePage' element={<ReplyMessagePage />} />







      </Routes>
    </>
  );
}

export default App;
