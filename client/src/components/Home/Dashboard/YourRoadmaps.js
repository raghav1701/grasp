import Add from '@mui/icons-material/Add';
import {
    Button,
    Icon,
    Typography,
    IconButton,
    Collapse,
    Snackbar,
} from '@mui/material';
import React, { useState, useEffect } from 'react';
import RoadmapList from '../../RoadmapList/RoadmapList';

import Alert from '@mui/material/Alert';
import CloseIcon from '@mui/icons-material/Close';

const buttonStyle = {
    marginTop: '1rem',
};

const YourRoadmaps = (props) => {
    const [roadmaps, setRoadmaps] = React.useState([]);
    const [open, setOpen] = useState(false);
    const [alerttext, setAlertText] = useState('');
    const [alerttype, setAlertType] = useState('success');
    const [loading, setLoading] = useState(true);

    const handleOpen = (text, type) => {
        setOpen(true);
        setAlertText(text);
        setAlertType(type);
    };
    const handleClose = () => setOpen(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                let result = await fetch(
                    `/profile/${props.user.username}/roadmaps`
                );
                result = await result.json();
                return result;
            } catch (e) {
                console.log(e);
            }
        };
        fetchUser().then((res) => {
            if (res && !res.error) setRoadmaps(res);
            setLoading(false);
        });
    }, [props.user]);

    return (
        <RoadmapList
            title={props.isEditable ? 'Your Roadmaps' : 'Roadmaps'}
            roadmaps={roadmaps}
            emptyText={'No roadmaps created yet.'}
            handleOpen={handleOpen}
            handleClose={handleClose}
            open={open}
            loading={loading}
        >
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert
                    onClose={handleClose}
                    severity={alerttype}
                    sx={{ width: '100%' }}
                >
                    {alerttext}
                </Alert>
            </Snackbar>
            {props.isEditable ? (
                <Button
                    onClick={() => {
                        props.modalClick();
                    }}
                    variant="contained"
                    style={buttonStyle}
                    color="secondary"
                >
                    <Icon style={{ color: 'white', marginRight: '10px' }}>
                        add
                    </Icon>
                    <Typography style={{ color: 'white' }}>CREATE</Typography>
                </Button>
            ) : null}
        </RoadmapList>
    );
};

export default YourRoadmaps;
