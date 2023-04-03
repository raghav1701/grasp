import {
    Grid,
    Typography,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Button,
    Tooltip,
    LinearProgress,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import EditRoadIcon from '@mui/icons-material/EditRoad';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import Chip from '@mui/material/Chip';
import { useContext, useState } from 'react';
import { UserContext } from '../../context/UserContext';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import RoadListItem from './RoadListItem';

const useStyles = makeStyles((theme) => ({
    container: {
        height: '100vh',
        margin: '0',
        display: 'flex',
        justifyContent: 'center',
    },
    Date_Class: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
    },
    chip: {
        pointerEvents: 'none',
        margin: '0.1em',
    },
}));

const Demo = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
}));

// props contain
// title
// roadmaps
// emptyText
const RoadmapList = (props) => {
    const classes = useStyles();
    const [user, setUser] = useContext(UserContext);

    const handleCloning = async (id) => {
        if (!id) {
            return { error: 'Invalid operation' };
        }
        try {
            let res = await fetch(`/roadmaps/fork/${id}`, {
                method: 'POST',
            });
            res = await res.json();
            if (res.error) throw res.error;
            props.handleOpen('Cloned successfully', 'success');
            setTimeout(() => {
                if (props.open) props.handleClose();
            }, 3000);
            return res;
        } catch (e) {
            props.handleOpen('Could not clone', 'error');
            return { error: e };
        }
    };

    const handleStars = async (id) => {
        if (!id) {
            return { error: 'Invalid operation' };
        }
        try {
            let res = await fetch(`/roadmaps/star/${id}`, {
                method: 'POST',
            });
            res = await res.json();
            if (res.error) throw res.error;
            props.handleOpen('Starred successfully');
            setTimeout(() => {
                if (props.open) props.handleClose();
            }, 3000);
            return res;
        } catch (e) {
            props.handleOpen(e || 'Could not star', 'error');
            return { error: e };
        }
    };

    return (
        <Grid container className={classes.container}>
            <Grid item xs={12} md={9}>
                <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
                    {`${props.title} (${props.roadmaps.length})`}
                </Typography>
                <hr />
                {props.loading ? <LinearProgress color="success" /> : null}
                {props.children}
                <Demo>
                    <List>
                        {props.roadmaps && props.roadmaps.length > 0 ? (
                            props.roadmaps.map((road, index) => {
                                return (
                                    <RoadListItem
                                        user={user}
                                        road={road}
                                        key={index}
                                        handleCloning={handleCloning}
                                        handleStars={handleStars}
                                    />
                                );
                            })
                        ) : (
                            <Typography style={{ textAlign: 'center' }}>
                                {props.emptyText}
                            </Typography>
                        )}
                    </List>
                </Demo>
            </Grid>
        </Grid>
    );
};

export default RoadmapList;
