import React, { useState, useEffect } from 'react';

interface Cat {
    _id: string;
    name: string;
    age: number;
    breed: string;
    imageUrl: string;
}

const FavoriteCat: React.FC = () => {
    const [favoriteCats, setFavoriteCats] = useState<Cat[]>([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUserId = localStorage.getItem('userId');
        if (token && storedUserId) {
            fetch(`http://localhost:5500/public-users/${storedUserId}/favorites`, {
                headers: {
                    Authorization: `${token}`,
                },
            })
                .then(response => response.json())
                .then(data => {
                    setFavoriteCats(data);
                })
                .catch(error => console.error(error));
        }
    }, []);

    const handleDelete = (catId: string) => {
        const token = localStorage.getItem('token');
        const storedUserId = localStorage.getItem('userId');
        if (token && storedUserId) {
            fetch(`http://localhost:5500/public-users/${storedUserId}/favorites/${catId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `${token}`,
                },
            })
                .then(() => {
                    // 删除成功后重新获取最新的收藏夹列表
                    return fetch(`http://localhost:5500/public-users/${storedUserId}/favorites`, {
                        headers: {
                            Authorization: `${token}`,
                        },
                    });
                })
                .then(response => response.json())
                .then(data => {
                    setFavoriteCats(data);
                })
                .catch(error => console.error(error));
        }
    };

    return (
        <div>
            <h1>收藏的猫列表</h1>
            {favoriteCats.map(cat => (
                <div key={cat._id}>
                    <h2>{cat.name}</h2>
                    <p>年龄: {cat.age}</p>
                    <p>品种: {cat.breed}</p>
                    <img
                        src={`http://localhost:5500/${cat.imageUrl}`}
                        alt={cat.name}
                        style={{ maxWidth: '300px', maxHeight: '300px' }}
                    />
                    <button onClick={() => handleDelete(cat._id)}>删除</button>
                    <hr />
                </div>
            ))}
        </div>
    );
};

export default FavoriteCat;
