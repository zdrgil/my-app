import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const LoginPublish: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [userId, setUserId] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUserId = localStorage.getItem('userId');
        if (token && storedUserId) {
            setIsLoggedIn(true);
            setUserId(storedUserId);
        }
    }, []);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        fetch('http://localhost:5500/login/public-users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    setIsLoggedIn(false);
                    throw new Error('无效的用户名或密码');
                }
            })
            .then((data) => {
                const { token, _id } = data;
                localStorage.setItem('token', token);
                localStorage.setItem('userId', _id);
                setIsLoggedIn(true);
                setUserId(_id);
                setErrorMessage('');
            })
            .catch((error) => {
                setIsLoggedIn(false);
                setErrorMessage(error.message);
            });
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        setIsLoggedIn(false);
        setUserId('');
    };

    return (
        <div>
            <h1>用户登录</h1>
            {isLoggedIn ? (
                <>
                    <p>登录成功！用户ID：{userId}</p>
                    <button onClick={handleLogout}>登出</button>
                    <Link to="/">
                        <button>主頁</button>
                    </Link>
                </>
            ) : (
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="用户名"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="密码"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {errorMessage && <p>{errorMessage}</p>}
                    <button type="submit">登录</button>
                </form>
            )}
        </div>
    );
};

export default LoginPublish;
