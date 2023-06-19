import React, { useEffect, useState } from 'react';

interface Cat {
    name: string;
    age: number;
    breed: string;
}

const AddCatForm: React.FC = () => {
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [breed, setBreed] = useState('');
    const [photo, setPhoto] = useState<File | null>(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [token, setToken] = useState<string>('');


    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const newCat: Cat = {
            name,
            age: parseInt(age),
            breed,
        };

        const formData = new FormData();
        formData.append('photo', photo as File);
        formData.append('name', name);
        formData.append('age', age);
        formData.append('breed', breed);

        try {
            const response = await fetch('http://localhost:5500/newcats', {
                method: 'POST',
                headers: {
                    Authorization: `${token}`,
                },
                body: formData,
            });

            const data = await response.json();
            setSuccessMessage('添加猫的详细信息成功');
            // 清空表单
            setName('');
            setAge('');
            setBreed('');
            setPhoto(null);
        } catch (error) {
            console.error('添加猫的详细信息失败:', error);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const fileList = e.target.files;
        if (fileList && fileList.length > 0) {
            setPhoto(fileList[0]);
        }
    };

    return (
        <div>
            <h2>添加猫的详细信息</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="猫的名称"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="猫的年龄"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="猫的品种"
                    value={breed}
                    onChange={(e) => setBreed(e.target.value)}
                    required
                />
                <input type="file" accept="image/*" onChange={handleFileChange} required />
                <button type="submit">添加</button>
            </form>
            {successMessage && <p>{successMessage}</p>}
        </div>
    );
};

export default AddCatForm;
