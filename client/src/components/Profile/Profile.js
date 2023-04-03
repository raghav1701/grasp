import { Box } from '@mui/system';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import classes from '../Home/Home.css';
import Navbar from '../Navbar/Navbar';
import Panel from '../Home/Dashboard/Dashboard';
import { Typography } from '@mui/material';

const Profile = () => {
    const [user, setUser] = useState({
        id: '',
        username: '',
        name: '',
        goals: [],
        connections: [],
        sent: [],
        received: [],
    });
    const params = useParams();
    const fetchProfile = async () => {
        try {
            let res = await fetch(`/profile/api/${params.username}`);
            res = await res.json();
            return res;
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchProfile().then((res) => {
            if (res.user) {
                setUser(res.user);
            } else {
                console.log(res.error);
            }
        });
    }, []);

    return (
        <div className={classes.Home}>
            <Navbar />
            <Box className={classes.Box}>
                {user ? (
                    <Panel user={user} />
                ) : (
                    <Typography color="error">Something went wrong</Typography>
                )}
            </Box>
        </div>
    );
};

export default Profile;
