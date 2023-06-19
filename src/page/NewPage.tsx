import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const NewPage: React.FC = () => {
    const [code, setCode] = useState('');
    const [token, setToken] = useState<string>('');

    const handleGenerateCode = () => {
        const generatedCode = uuidv4();
        setCode(generatedCode);
    };

    useEffect(() => {

        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    const handleSaveCode = () => {
        fetch('http://localhost:5500/registration-codes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `${token}`,

            },
            body: JSON.stringify({ code }),
        })
            .then((response) => {
                if (response.ok) {
                    console.log('Registration code saved successfully.');
                } else {
                    throw new Error('Failed to save registration code.');
                }
            })
            .catch((error) => {
                console.error('Error saving registration code:', error);
            });
    };

    return (
        <div>
            <h1>New Page</h1>
            <button onClick={handleGenerateCode}>生成注册代码</button>
            <p>生成的注册代码: {code}</p>
            <button onClick={handleSaveCode}>保存注册代码</button>
            {/* 页面内容 */}
        </div>
    );
};

export default NewPage;
