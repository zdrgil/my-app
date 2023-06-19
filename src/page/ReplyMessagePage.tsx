import React, { useState, useEffect } from 'react';

interface Message {
    _id: string;
    content: string;
    replied: boolean;
    replyContent?: string;
}

const ReplyMessagePage: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [replyContent, setReplyContent] = useState('');
    const [selectedMessageId, setSelectedMessageId] = useState('');

    useEffect(() => {
        const storedUserId = localStorage.getItem('adminId');
        const storedToken = localStorage.getItem('token');

        if (storedUserId && storedToken) {
            // 獲取消息列表
            fetchMessages(storedUserId, storedToken);
        }
    }, []);

    const fetchMessages = async (adminId: string, token: string) => {
        try {
            const response = await fetch(`http://localhost:5500/getmessages`, {
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

    const handleReply = (messageId: string) => {
        setSelectedMessageId(messageId);
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const storedToken = localStorage.getItem('token');

            if (storedToken) {
                const response = await fetch('http://localhost:5500/messages/reply', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: storedToken,
                    },
                    body: JSON.stringify({
                        messageId: selectedMessageId,
                        replyContent: replyContent,
                    }),
                });

                if (response.ok) {
                    // 回覆訊息成功後重新獲取訊息列表
                    fetchMessages(localStorage.getItem('adminId') || '', storedToken);
                    setReplyContent('');
                    setSelectedMessageId('');
                    alert('回覆訊息成功！');
                } else {
                    const data = await response.json();
                    alert(`回覆訊息失敗：${data.error}`);
                }
            }
        } catch (error) {
            console.error(error);
            alert('回覆訊息時發生錯誤');
        }
    };

    const handleUpdate = async (messageId: string) => {
        const updatedReplyContent = prompt('請輸入新的回覆內容：');
        if (updatedReplyContent) {
            try {
                const storedToken = localStorage.getItem('token');

                if (storedToken) {
                    const response = await fetch(`http://localhost:5500/messages/reply/${messageId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: storedToken,
                        },
                        body: JSON.stringify({
                            replyContent: updatedReplyContent,
                        }),
                    });

                    if (response.ok) {
                        // 更新回覆成功後重新獲取訊息列表
                        fetchMessages(localStorage.getItem('adminId') || '', storedToken);
                        alert('回覆更新成功！');
                    } else {
                        const data = await response.json();
                        alert(`回覆更新失敗：${data.error}`);
                    }
                }
            } catch (error) {
                console.error(error);
                alert('更新回覆時發生錯誤');
            }
        }
    };

    const handleDelete = async (messageId: string) => {
        const confirmDelete = window.confirm('確定要刪除此回覆嗎？');
        if (confirmDelete) {
            try {
                const storedToken = localStorage.getItem('token');

                if (storedToken) {
                    const response = await fetch(`http://localhost:5500/messages/reply/${messageId}`, {
                        method: 'DELETE',
                        headers: {
                            Authorization: storedToken,
                        },
                    });

                    if (response.ok) {
                        // 刪除回覆成功後重新獲取訊息列表
                        fetchMessages(localStorage.getItem('adminId') || '', storedToken);
                        alert('回覆刪除成功！');
                    } else {
                        const data = await response.json();
                        alert(`回覆刪除失敗：${data.error}`);
                    }
                }
            } catch (error) {
                console.error(error);
                alert('刪除回覆時發生錯誤');
            }
        }
    };

    return (
        <div>
            <h1>回覆訊息</h1>
            <ul>
                {messages.map((message) => (
                    <li key={message._id}>
                        <div>{message.content}</div>
                        {message.replied ? (
                            <div>
                                <strong>回覆：</strong>
                                {message.replyContent}
                                <button onClick={() => handleUpdate(message._id)}>更新回复</button>
                                <button onClick={() => handleDelete(message._id)}>删除回复</button>
                            </div>
                        ) : (
                            <div>
                                {selectedMessageId === message._id ? (
                                    <form onSubmit={handleFormSubmit}>
                                        <textarea
                                            value={replyContent}
                                            onChange={(e) => setReplyContent(e.target.value)}
                                            placeholder="輸入回覆內容..."
                                            rows={4}
                                        />
                                        <button type="submit">提交回覆</button>
                                    </form>
                                ) : (
                                    <button onClick={() => handleReply(message._id)}>新增回覆</button>
                                )}
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ReplyMessagePage;
