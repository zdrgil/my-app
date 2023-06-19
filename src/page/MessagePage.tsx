import React, { useState, useEffect } from 'react';

interface Message {
    _id: string;
    content: string;
    replied: boolean;
    replyContent?: string;
}

const MessagePage: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        const storedToken = localStorage.getItem('token');

        if (storedUserId && storedToken) {
            // 获取消息列表
            fetchMessages(storedUserId, storedToken);
        }
    }, []);

    const fetchMessages = async (userId: string, token: string) => {
        try {
            const response = await fetch(`http://localhost:5500/messages/${userId}`, {
                headers: {
                    Authorization: token,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setMessages(data);
            } else {
                console.error('Failed to fetch messages');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const sendMessage = async () => {
        try {
            const storedUserId = localStorage.getItem('userId');
            const storedToken = localStorage.getItem('token');

            if (storedUserId && storedToken) {
                const response = await fetch('http://localhost:5500/messages', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: storedToken,
                    },
                    body: JSON.stringify({
                        userId: storedUserId,
                        content: newMessage,
                    }),
                });

                if (response.ok) {
                    // 发送消息成功后刷新消息列表
                    fetchMessages(storedUserId, storedToken);
                    setNewMessage('');
                    alert('消息发送成功！');
                } else {
                    const data = await response.json();
                    alert(`消息发送失败：${data.error}`);
                }
            }
        } catch (error) {
            console.error(error);
            alert('发送消息时发生错误');
        }
    };

    return (
        <div>
            <h1>发送消息</h1>
            <div>
                <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="输入您要发送的消息..."
                    rows={4}
                />
                <button onClick={sendMessage}>发送</button>
            </div>
            <h1>回复消息</h1>
            <ul>
                {messages.map((message) => (
                    <li key={message._id}>
                        <div>{message.content}</div>
                        {message.replied && (
                            <div>
                                <strong>回复：</strong>
                                {message.replyContent}
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MessagePage;
