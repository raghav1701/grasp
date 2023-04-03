import {
    AppBar,
    Divider,
    List,
    ListItem,
    TextField,
    Toolbar,
    Typography,
    IconButton,
    Icon,
    Button,
    Fab,
    LinearProgress,
    Card,
    CardContent,
    Avatar,
} from '@mui/material';
import { Box, styled, useTheme } from '@mui/system';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';
import { useEffect, useRef, useState } from 'react';
import Message from './Message';

const IconButtonCustom = styled(IconButton)(({ theme }) => ({
    marginRight: '1em',
    [theme.breakpoints.up('sm')]: {
        display: 'none',
    },
}));

const MessageField = styled(TextField)(({ theme }) => ({
    width: '100%',
    backgroundColor: 'transparent',
    '& .MuiInputBase-root': {
        color: 'white',
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: 'white',
    },
}));

const Chat = (props) => {
    const { user, setSelectedUser, socket, people, sender, online } = props; // user is selected user //sender is self uid
    const theme = useTheme();
    const listRef = useRef(null);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const sendMessage = () => {
        if (message === '' || socket === '') return;
        socket.emit(
            'messageToEnd',
            {
                people: people,
                message: {
                    sender: sender,
                    content: message.trim(),
                },
            },
            (data) => {
                console.log('Message sent!');
            }
        );

        setMessage('');
    };

    useEffect(() => {
        if (socket) {
            // incomming messages
            socket.on('MessagefromEnd', (message) => {
                setMessages((prev) => {
                    return [
                        ...prev,
                        {
                            ...message,
                        },
                    ];
                });
            });
        }
    }, [socket]);

    useEffect(() => {
        setLoading(true);
        setMessages([]);
        const fetchPreviousMessages = async () => {
            try {
                let res = await fetch(`/profile/api/messages/${user.username}`);
                res = await res.json();
                return res;
            } catch (e) {
                console.log(e);
            }
        };
        if (user._id) {
            fetchPreviousMessages()
                .then((res) => {
                    if (!res.error) setMessages(res);
                    setLoading(false);
                })
                .then(() => {
                    // setTimeout(() => {
                    // }, 5000);
                    listRef.current.scrollTop = listRef.current.scrollHeight;
                    // setOpen(true);
                })
                .catch((err) => {
                    setLoading(false);
                });
        }
    }, [user]);

    useEffect(() => {
        try {
            listRef.current.scrollTop = listRef.current.scrollHeight;
            // console.log(listRef.current.style);
        } catch (e) {
            // console.log(e);
        }
    }, [props, messages]);

    const formatDate = (date) => {
        const d = new Date(date).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });

        return d;
    };

    const getFormattedTime = (time) => {
        const start = formatDate(time);

        return `${start}`;
    };

    const getFormattedDate = (time) => new Date(time).toDateString();

    if (user._id)
        return (
            <Box style={{ position: 'relative', height: '100%' }}>
                <AppBar
                    position="static"
                    color="transparent"
                    style={{ background: '#2A2438' }}
                >
                    <Toolbar style={{ minHeight: '10vh', height: '10vh' }}>
                        <IconButtonCustom
                            theme={theme}
                            onClick={() => setSelectedUser({})}
                        >
                            <ArrowBackIcon />
                        </IconButtonCustom>
                        <Avatar style={{ margin: '1rem' }} src={user.avatar} />
                        <Box>
                            <Typography color="#DBD8E3">{user.name}</Typography>
                            <Typography variant="caption" color="green">
                                {online ? 'Online' : ''}
                            </Typography>
                        </Box>
                    </Toolbar>
                </AppBar>
                {loading ? <LinearProgress color="success" /> : null}
                <List
                    ref={listRef}
                    style={{
                        height: '80vh',
                        overflow: 'auto',
                    }}
                >
                    {!loading && messages.length === 0 && (
                        <Typography
                            align="center"
                            sx={{
                                padding: '1rem',
                                color: 'text.disabled',
                            }}
                        >
                            Start your conversation with {user.name} here.
                        </Typography>
                    )}
                    {!loading &&
                        messages.map((m, index) => {
                            let datecard = false;
                            if (index === 0) datecard = true;
                            else {
                                let t1 = m.createdAt.split('T')[0];
                                let t2 =
                                    messages[index - 1].createdAt.split('T')[0];
                                if (t1 !== t2) datecard = true;
                            }
                            return (
                                <ListItem
                                    key={index}
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                    }}
                                >
                                    {datecard && (
                                        <Box
                                            style={{
                                                alignSelf: 'center',
                                                borderRadius: '5px',
                                                backgroundColor: '#ddd',
                                                padding: '0.5em',
                                            }}
                                        >
                                            <Typography
                                                variant="p"
                                                style={{
                                                    fontSize: '0.8rem',
                                                }}
                                            >
                                                {getFormattedDate(m.createdAt)}
                                            </Typography>
                                        </Box>
                                    )}
                                    <Message
                                        other={m.sender !== sender}
                                        content={m.content}
                                        sender={m.sender}
                                        timestamp={getFormattedTime(
                                            m.createdAt
                                        )}
                                        avatar={user.avatar}
                                    />
                                </ListItem>
                            );
                        })}
                </List>
                <Divider />
                <AppBar
                    position="absolute"
                    color="transparent"
                    style={{
                        bottom: 0,
                        top: 'auto',

                        backgroundColor: '#2A2438',
                    }}
                >
                    <Toolbar style={{ minHeight: '10vh', height: '10vh' }}>
                        <MessageField
                            theme={theme}
                            variant="standard"
                            placeholder="Message"
                            // multiline
                            // maxRows={1}
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={(e) => {
                                if (
                                    e.code === 'Enter' ||
                                    e.code === 'NumpadEnter'
                                ) {
                                    sendMessage();
                                }
                            }}
                        />
                        <IconButton
                            onClick={sendMessage}
                            disabled={message.trim().length === 0}
                            sx={{
                                color: 'white',
                            }}
                        >
                            <SendIcon />
                        </IconButton>
                    </Toolbar>
                </AppBar>
            </Box>
        );

    return (
        <Box style={{ position: 'relative', height: '100%' }}>
            <Box
                style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                }}
            >
                <Typography color="primary" variant="h3" align="center">
                    Grasp
                </Typography>
                <Typography
                    sx={{ color: 'text.disabled', width: '100%' }}
                    align="center"
                >
                    Select a connection to start messaging.
                </Typography>
            </Box>
        </Box>
    );
};

export default Chat;
