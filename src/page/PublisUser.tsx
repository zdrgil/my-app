import React, { useState } from 'react';

const PublishUser: React.FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isRegistered, setIsRegistered] = useState(false);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        fetch('http://localhost:5500/register/public-users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password }),
        })
            .then((response) => {
                if (response.ok) {
                    setIsRegistered(true);
                    setErrorMessage('');
                } else {
                    setIsRegistered(false);
                    throw new Error('注册失败，请稍后再试');
                }
            })
            .catch((error) => {
                setIsRegistered(false);
                setErrorMessage(error.message);
            });
    };

    return (
        <div>
            <h1>用户注册</h1>
            {isRegistered ? (
                <p>注册成功！</p>
            ) : (
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="用户名"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type="email"
                        placeholder="电子邮箱"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="密码"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {errorMessage && <p>{errorMessage}</p>}
                    <button type="submit">注册</button>
                </form>
            )}
        </div>
    );
};

export default PublishUser;
