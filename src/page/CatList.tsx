import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface Cat {
    _id: string;
    name: string;
    age: number;
    breed: string;
    imageUrl: string;
}

const CatList: React.FC = () => {
    const [cats, setCats] = useState<Cat[]>([]);
    const [editCat, setEditCat] = useState<Cat | null>(null);
    const [selectedBreed, setSelectedBreed] = useState<string>('');
    const [token, setToken] = useState<string>('');

    useEffect(() => {
        getCats();
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    const getCats = () => {
        fetch('http://localhost:5500/catslist')
            .then((response) => response.json())
            .then((data: Cat[]) => setCats(data))
            .catch((error) => {
                console.error('获取猫的信息失败:', error);
            });
    };

    const handleSaveCat = (updatedCat: Cat) => {
        const formData = new FormData();
        formData.append('_id', updatedCat._id);
        formData.append('name', updatedCat.name);
        formData.append('age', String(updatedCat.age));
        formData.append('breed', updatedCat.breed);
        if (updatedCat.imageUrl) {
            formData.append('imageUrl', updatedCat.imageUrl);
        }

        fetch(`http://localhost:5500/catslist/edit/${updatedCat._id}`, {
            method: 'PUT',
            headers: {
                Authorization: `${token}`,
            },
            body: formData,
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('猫的信息已更新:', data);
                setEditCat(null);
                // 在更新猫信息成功后再获取最新的猫列表
                getCats();
            })
            .catch((error) => {
                console.error('更新猫的信息失败:', error);
            });
    };

    const handleDeleteCat = (id: string) => {
        fetch(`http://localhost:5500/catslist/delete/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `${token}`,
            },
        })
            .then(() => {
                console.log('猫的信息已删除:', id);
                getCats();
            })
            .catch((error) => {
                console.error('删除猫的信息失败:', error);
            });
    };

    const handleCancelEdit = () => {
        setEditCat(null);
    };

    const handleSelectBreed = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedBreed(event.target.value);
    };

    const filteredCats = selectedBreed
        ? cats.filter((cat) => cat.breed.toLowerCase() === selectedBreed.toLowerCase())
        : cats;

    return (
        <div>
            <h2>所有猫的信息</h2>
            <Link to="/newcat">新增猫</Link>
            <select value={selectedBreed} onChange={handleSelectBreed}>
                <option value="">所有品种</option>
                {Array.from(new Set(cats.map((cat) => cat.breed))).map((breed) => (
                    <option key={breed} value={breed}>
                        {breed}
                    </option>
                ))}
            </select>
            {filteredCats.length > 0 ? (
                <ul>
                    {filteredCats.map((cat) => (
                        <li key={cat._id}>
                            <strong>名称:</strong> {cat.name},
                            <strong>年龄:</strong> {cat.age},
                            <strong>品种:</strong> {cat.breed}
                            <img src={`http://localhost:5500/${cat.imageUrl}`} alt={cat.name} />
                            {editCat && editCat._id === cat._id ? (
                                <EditForm cat={editCat} onSave={handleSaveCat} onCancel={handleCancelEdit} />
                            ) : (
                                <div>
                                    <button onClick={() => setEditCat(cat)}>编辑</button>
                                    <button onClick={() => handleDeleteCat(cat._id)}>删除</button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>暂无符合条件的猫的信息</p>
            )}
        </div>
    );
};

interface EditFormProps {
    cat: Cat;
    onSave: (updatedCat: Cat) => void;
    onCancel: () => void;
}

const EditForm: React.FC<EditFormProps> = ({ cat, onSave, onCancel }) => {
    const [name, setName] = useState(cat.name);
    const [age, setAge] = useState(cat.age);
    const [breed, setBreed] = useState(cat.breed);
    const [photo, setPhoto] = useState<File | null>(null);
    const [token, setToken] = useState<string>('');

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    const handleSave = () => {
        const updatedCat: Cat = {
            ...cat,
            name,
            age,
            breed,
            imageUrl: cat.imageUrl,
        };

        const formData = new FormData();
        formData.append('_id', updatedCat._id);
        formData.append('imageUrl', updatedCat.imageUrl);
        formData.append('name', name);
        formData.append('age', String(age));
        formData.append('breed', breed);
        if (photo) {
            formData.append('photo', photo);
        }

        fetch(`http://localhost:5500/catslist/edit/${cat._id}`, {
            method: 'PUT',
            headers: {
                Authorization: `${token}`,
            },
            body: formData,
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('猫的信息已更新:', data);
                onSave(data);
            })
            .catch((error) => {
                console.error('更新猫的信息失败:', error);
            });
    };

    const handleCancel = () => {
        onCancel();
    };

    const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            setPhoto(files[0]);
        }
    };

    return (
        <div>
            <h3>编辑猫的信息</h3>
            <form>
                <label>
                    名称:
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                </label>
                <label>
                    年龄:
                    <input type="number" value={age} onChange={(e) => setAge(Number(e.target.value))} />
                </label>
                <label>
                    品种:
                    <input type="text" value={breed} onChange={(e) => setBreed(e.target.value)} />
                </label>
                <label>
                    图片:
                    <input type="file" onChange={handlePhotoChange} />
                </label>
                <button type="button" onClick={handleSave}>
                    保存
                </button>
                <button type="button" onClick={handleCancel}>
                    取消
                </button>
            </form>
        </div>
    );
};

export default CatList;
