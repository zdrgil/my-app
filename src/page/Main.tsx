import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Cat {
  _id: string;
  name: string;
  age: number;
  breed: string;
  imageUrl: string;
}

const Main: React.FC = () => {
  const [cats, setCats] = useState<Cat[]>([]);
  const [userId, setUserId] = useState('');
  const [token, setToken] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUserId = localStorage.getItem('userId');
    if (token && storedUserId) {
      setUserId(storedUserId);
      setToken(token);
    }

    fetch('http://localhost:5500/catslist')
      .then(response => response.json())
      .then(data => {
        // 过滤猫列表
        const filteredCats = data.filter((cat: { name: string; }) =>
          cat.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setCats(filteredCats);
      })
      .catch(error => console.error(error));
  }, [searchTerm]);


  const handleAddToFavorites = (catId: string) => {
    fetch(`http://localhost:5500/public-users/${userId}/favorites`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token}`,
      },
      body: JSON.stringify({ _id: catId }),
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('添加到收藏夹失败');
        }
      })
      .then(data => {
        console.log('添加到收藏夹成功', data);
        // 更新界面或显示成功提示
      })
      .catch(error => {
        console.error(error);
        // 处理错误情况
      });
  };

  return (
    <div>
      <h1>所有猫的信息</h1>
      <Link to="/login/public-users">
        <button>登入</button>
      </Link>
      <Link to="/register/public-users">
        <button>register</button>
      </Link>
      <Link to="/public-users/favorites">
        <button>favorite</button>
      </Link>
      <Link to="/public-users/MessagePage">
        <button>Message</button>
      </Link>
      <div>
        <input
          type="text"
          value={searchTerm}
          onChange={event => setSearchTerm(event.target.value)}
          placeholder="搜索猫的名称"
        />
      </div>
      {cats.map((cat: Cat) => (
        <div key={cat._id}>
          <h2>{cat.name}</h2>
          <p>年龄: {cat.age}</p>
          <p>品种: {cat.breed}</p>
          <img
            src={`http://localhost:5500/${cat.imageUrl}`}
            alt={cat.name}
            style={{ maxWidth: '300px', maxHeight: '300px' }}
          />
          {userId && (
            <button onClick={() => handleAddToFavorites(cat._id)}>添加到收藏</button>
          )}
          <hr />
        </div>
      ))}
    </div>
  );
};

export default Main;
