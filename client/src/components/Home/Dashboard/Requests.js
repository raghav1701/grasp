import UserList from '../../UserList/UserList';
import UserConnectionRequestItem from '../../UserList/UserConnectionRequestItem';
import { Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import NewConnection from './NewConnection';
import { Box } from '@mui/system';

const Requests = (props) => {
    const { user, setUser } = props;
    const [received, setReceived] = useState([]);
    const [toggle, setToggle] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchReceived = async () => {
        let res = await fetch(`/profile/received`);
        res = await res.json();
        return res;
    };

    const mount = (u) => {
        setReceived((prev) => {
            let unames = prev.map((p) => p.username);
            let index = unames.indexOf(u.username);
            index > -1 && prev.splice(index, 1);
            return prev;
        });
        setToggle((prev) => !prev);
    };

    const handleAccept = async (e, u) => {
        e.stopPropagation();
        try {
            let res = await fetch(`/profile/${u.username}/accept`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            res = await res.json();
            if (res.success) mount(u);

            //Rest will done by backend developer (On Current Project)
        } catch (err) {
            console.log(err);
        }
    };

    const handleDecline = async (e, u) => {
        e.stopPropagation();
        try {
            let res = await fetch(`/profile/${u.username}/reject`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            res = await res.json();
            if (res.success) mount(u);

            // Rest will done by backend developer (On Current Project)
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchReceived().then((res) => {
            if (res.profiles) setReceived(res.profiles);
            setLoading(false);
        });
    }, [toggle, props.user]);

    return (
        <Box>
            <UserList users={received} title="Users" loading={loading}>
                {received.length > 0 ? (
                    received.map((user, index) => {
                        return (
                            <UserConnectionRequestItem
                                key={index}
                                curuser={user}
                                index={index}
                                handleAccept={handleAccept}
                                handleDecline={handleDecline}
                                type="Received"
                            />
                        );
                    })
                ) : (
                    <Typography
                        style={{ textAlign: 'center', marginTop: '1rem' }}
                    >
                        No received requests yet.
                    </Typography>
                )}
            </UserList>
        </Box>
    );
};

export default Requests;
