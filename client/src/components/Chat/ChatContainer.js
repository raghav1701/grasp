import {
    Box,
    Divider,
    Grid,
    LinearProgress,
    Paper,
    TextField,
    Toolbar,
    Typography,
} from '@mui/material';
import { styled, useTheme } from '@mui/system';
import { io } from 'socket.io-client';
import { useContext, useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router';
import Navbar from '../Navbar/Navbar';
import UserList from '../UserList/UserList';
import classes from './Chat.css';
import { UserContext } from '../../context/UserContext';
import UserListItem from '../UserList/UserListItem';
import UserListChatItem from '../UserList/UserListChatItem';
import UserListChat from '../UserList/UserListChat';
import Chat from './Chat.js';

const ChatGridContainer = styled(Grid)(({ theme, open }) => ({
    height: '100vh',
    overflow: 'hidden',
    [theme.breakpoints.down('sm')]: {
        position: 'absolute',
        width: '100vw',
        right: `${open ? '0' : '-100%'}`,
        top: 0,
        zIndex: '1500',
        backgroundColor: 'white',
        transition: '0.5s ease',
    },
    [theme.breakpoints.up('sm')]: {
        // backgroundColor: 'green',
    },
}));

const ChatContainer = () => {
    const theme = useTheme();
    const params = useParams();
    const location = useLocation();
    const { chatUser } = location.state;
    const [user, setUser] = useContext(UserContext);
    const [selectedUser, setSelectedUser] = useState(chatUser || {});
    const [connections, setConnections] = useState([]);
    const [list, setList] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    const [socket, setSocket] = useState(null);
    const [onlineUser, setOnlineUser] = useState([]);
    const [people, setPeople] = useState(null);

    useEffect(() => {
        setSocket(io('/chat'));

        return () => {
            if (socket) socket.emit('forceDis');
        };
    }, []);

    useEffect(() => {
        if (socket) {
            socket.on('connect', () => {

                // telling that i am online
                socket.emit('iamOnline', { user: user });

                //getting online users from server for this perticular socket client
                socket.on('userOnlineUpdate', (data) => {
                    let emitOnlineUser = data.filter((user) => {
                        return connections.map((u) => u._id).includes(user.uid);
                    });
                    setOnlineUser(emitOnlineUser);
                });
            });
        }
    }, [socket, connections]);

    const fetchConnections = async () => {
        let res = await fetch(`/profile/connections`);
        res = await res.json();
        return res;
    };

    useEffect(() => {
        // fetching all users in connection (online & offline)
        fetchConnections().then((res) => {
            if (res.profiles)
                setConnections((prev) => {
                    setList(res.profiles);
                    return res.profiles;
                });
            setLoading(false);
        });
    }, []);

    const handleSearchChange = (e) => {
        setSearch(e.target.value);

        if (e.target.value === '') {
            setList(connections);
            return;
        }

        setList(() => {
            return connections.filter(
                (u) =>
                    // u.name.search(e.target.value) !== -1 ||
                    u.username.search(e.target.value) !== -1
            );
        });
    };

    const setSelectedUserHandler = (con_user) => {

        if (people) {
            socket.emit(
                'leaveAndJoin',
                {
                    toLeave: people.join(''),
                    toJoin: [con_user._id, user._id].sort().join(''),
                },
                (data) => {
                    // setRoom()
                    setSelectedUser(con_user);
                    setPeople([con_user._id, user._id].sort());
                }
            );
        } else {
            socket.emit(
                'joinRoom',
                {
                    room: [con_user._id, user._id].sort().join(''),
                },
                (data) => {
                    setSelectedUser(con_user);
                    setPeople([con_user._id, user._id].sort());
                }
            );
        }
    };

    // if (user)
    return (
        <Grid
            container
            style={{
                height: '100vh',
                position: 'relative',
            }}
        >
            <Grid
                item
                xs={12}
                sm={4}
                style={{
                    height: '100%',
                    overflow: 'hidden',
                    borderRight: '1px solid #ccc',
                }}
            >
                {/* main nav bar */}
                <Navbar message={false} />
                {loading ? <LinearProgress color="success" /> : null}
                <Paper>
                    <Toolbar style={{ minHeight: '10vh', height: '10vh' }}>
                        <TextField
                            placeholder="Search connections"
                            size="small"
                            style={{ width: '100%' }}
                            value={search}
                            onChange={handleSearchChange}
                        />
                    </Toolbar>
                </Paper>
                <UserListChat
                    users={list}
                    loading={loading}
                    title="Connections"
                >
                    {list.length > 0 ? (
                        list.map((user, index) => {
                            return (
                                <UserListChatItem
                                    key={index}
                                    curuser={user}
                                    index={index}
                                    setSelectedUser={setSelectedUserHandler}
                                    selectedUser={selectedUser}
                                    online={onlineUser
                                        .map((u) => u.uid)
                                        .includes(user._id)}
                                />
                            );
                        })
                    ) : (
                        <Typography
                            style={{
                                textAlign: 'center',
                                marginTop: '1rem',
                            }}
                        >
                            {loading ? 'Loading...' : 'No connections yet.'}
                        </Typography>
                    )}
                </UserListChat>
            </Grid>
            <ChatGridContainer
                item
                xs={12}
                sm={8}
                theme={theme}
                open={selectedUser._id ? true : false}
            >
                <Chat
                    sender={user._id}
                    people={people}
                    socket={socket || ''}
                    user={selectedUser}
                    setSelectedUser={setSelectedUserHandler}
                    online={onlineUser
                        .map((u) => u.uid)
                        .includes(selectedUser._id)}
                />
            </ChatGridContainer>
        </Grid>
    );

    // else return <Box></Box>;
};

export default ChatContainer;
