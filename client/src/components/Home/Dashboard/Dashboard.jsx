import React, { useEffect, useRef, useState } from 'react';
import { UserContext } from '../../../context/UserContext';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

//componennt
import MainCalendar from './MainCalendar/MainCalendar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';
import { Edit, WindowRounded } from '@mui/icons-material';

//classes
import classes from './Dashboard.css';
import './Dashboard.css';
import { Box } from '@mui/system';
import {
    Avatar,
    Chip,
    CircularProgress,
    Dialog,
    FormControl,
    FormGroup,
    Grid,
    Tooltip,
    Typography,
} from '@mui/material';
import RoadmapList from '../../RoadmapList/RoadmapList';
import UserList from '../../UserList/UserList';
import UserListItem from '../../UserList/UserListItem';
import UserConnectionRequestItem from '../../UserList/UserConnectionRequestItem';
import Connections from './Connections';
import YourRoadmaps from './YourRoadmaps';

import CreateRoadmap from './CreateRoadmap/CreateRoadmap';

import Pending from './Pending';
import Requests from './Requests';
import NewConnection from './NewConnection';

const style = {
    p: 4,
};

const inputs = {
    margin: '1rem auto',
};

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            <Box>{children}</Box>
        </div>
    );
}

const Panel = (props) => {
    const [details, setDetails] = React.useState(props.user);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');
    const [user, setUser] = React.useContext(UserContext);
    const [isEditable, setIsEditable] = React.useState(false);
    const [addgoals, setAddgoals] = React.useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [open, setOpen] = useState(false);
    const [mount, setMount] = useState(false);
    const [value, setValue] = React.useState(0);
    const imageInputRef = useRef(null);

    const [editGoals, setEditGoals] = useState([
        'Flying',
        'Singning',
        'Coding',
        'Parking Car',
    ]);
    const [newGoal, setNewGoal] = useState(null);

    const [showCreateRoadMap, setShowCreteRoadmap] = useState(false);

    const handleOpen = () => {
        setOpen(true);
        setEditGoals([...details.goals]);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const handleDelete = (i) => {
        setEditGoals((prev) => {
            let newgoal = [...prev];
            newgoal.splice(i, 1);
            return newgoal;
        });
    };

    const createRoadmapHandler = () => {
        setShowCreteRoadmap(true);
    };

    const closeRoadmapHandler = () => {
        setShowCreteRoadmap(false);
    };

    const handleClick = () => {
        console.info('You clicked the Chip.');
    };
    const handleTabChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleFileInput = (e) => {
        if (imageInputRef)
            imageInputRef.current.click()
    }

    const handleFileChange = async (e) => {
        try {
            let fd = new FormData();
            fd.append('avatar', imageInputRef.current.files[0]);
            let res = await fetch('/profile/upload', { method: 'POST', body: fd });
            res = await res.json();
            if (res.link) {
                props.setUser(prev => {
                    return {
                        ...prev,
                        avatar: res.link
                    };
                })
                setMount(prev => !prev);
            }
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        if (details.username === user.username) {
            setIsEditable(true);
        }
    }, [details, user, props, mount]);

    const selectHandler = (dateArray) => {
        setSelectedDate(dateArray);
    };

    const handleEditChange = (e) => {
        let { name, value } = e.target;
        setDetails((prev) => {
            return {
                ...prev,
                [name]: value,
            };
        });
    };

    const addGoalHandlerNew = () => {
        if (newGoal != null) {
            setEditGoals((prev) => [...prev, newGoal]);
            setNewGoal(null);
        }
    };

    const handleSubmit = async () => {
        try {
            if (!details.name) {
                setError('Invalid fields');
                return;
            }
            setLoading(true);
            let res = await fetch('/profile/update', {
                method: 'PATCH',
                body: JSON.stringify({ ...details, goals: editGoals }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            res = await res.json();
            setDetails((prev) => ({
                ...prev,
                goals: editGoals,
            }));
            if (res.error) {
                setError(res.error);
            } else {
                props.setUser &&
                    props.setUser((prev) => {
                        return {
                            ...prev,
                            name: details.name,
                            about: details.about,
                            goals: editGoals,
                        };
                    });
                handleClose();
            }
            setLoading(false);
        } catch (e) {
            setError('Something went wrong');
        }
    };

    return (
        <Box className={classes.Container}>
            {/* Create Roadmap Modal */}
            {showCreateRoadMap && (
                <div className={classes.CR_Modal}>
                    <div
                        className={classes.Backdrop}
                        onClick={closeRoadmapHandler}
                    />
                    <CreateRoadmap handleClose={closeRoadmapHandler} />
                </div>
            )}

            {/* profile  */}
            <Box>
                <Grid container className={classes.Profile}>
                    <Grid
                        item
                        style={{
                            position: 'relative',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Avatar src={`${props.user.avatar}?${mount}`} onClick={isEditable ? handleFileInput : null} style={{
                            width: '150px',
                            height: '150px',
                            borderRadius: '50%',
                            cursor: `${isEditable ? 'pointer' : 'default'}`
                        }} />
                        {
                            isEditable ? <input ref={imageInputRef} name='avatar' onChange={handleFileChange} type='file' accept='image/jpeg' style={{ position: 'absolute', visibility: 'hidden' }} />
                                : null
                        }
                    </Grid>
                    <Grid item className={classes.info}>
                        <Box className={classes.fieldContainer}>
                            <Typography style={{ color: 'grey' }}>
                                Username
                            </Typography>
                            <Typography>{props.user.username}</Typography>
                        </Box>
                        <Box className={classes.fieldContainer}>
                            <Typography style={{ color: 'grey' }}>
                                Name
                            </Typography>
                            <Typography> {props.user.name} </Typography>
                        </Box>
                        <Box className={classes.fieldContainer}>
                            <Typography style={{ color: 'grey' }}>
                                About
                            </Typography>
                            <Typography
                                style={{
                                    color: `${props.user.about ? 'black' : 'grey'
                                        }`,
                                }}
                            >
                                {props.user.about
                                    ? props.user.about
                                    : 'The user has not mentioned about them.'}{' '}
                            </Typography>
                        </Box>
                        <Box className={classes.fieldContainer}>
                            <Typography style={{ color: 'grey' }}>
                                Goals
                            </Typography>
                            {props.user.goals && props.user.goals.length > 0 ? (
                                props.user.goals.map((g, index) => (
                                    <Chip
                                        key={index}
                                        label={g}
                                        style={{
                                            margin: '0.2em',
                                            backgroundColor: 'lightgreen',
                                        }}
                                    />
                                ))
                            ) : (
                                <Typography style={{ color: 'grey' }}>
                                    The user has not set any goals yet.
                                </Typography>
                            )}
                        </Box>
                    </Grid>

                    {isEditable ? (
                        <Grid item style={{ position: 'absolute', bottom: 0, right: 0 }}>
                            <Tooltip title="Edit" style={{}} onClick={handleOpen}>
                                <IconButton color="primary">
                                    <Edit />
                                </IconButton>
                            </Tooltip>
                            <Dialog
                                open={open}
                                onClose={handleClose}
                                scroll='paper'
                                aria-labelledby="scroll-dialog-title"
                                aria-describedby="scroll-dialog-description"
                            >
                                <Box sx={style}>
                                    <Typography
                                        variant="h6"
                                        component="h2"
                                        style={{ textAlign: 'center' }}
                                    >
                                        Edit Profile
                                    </Typography>
                                    <TextField
                                        id="outlined-username"
                                        label="Username"
                                        disabled
                                        value={details.username}
                                        style={{ width: '100%' }}
                                        sx={inputs}
                                    />
                                    <TextField
                                        id="outlined"
                                        label="Name"
                                        placeholder="Your name"
                                        value={details.name}
                                        name="name"
                                        onChange={handleEditChange}
                                        style={{ width: '100%' }}
                                        sx={inputs}
                                    />
                                    <TextField
                                        id="outlined"
                                        label="About"
                                        placeholder="Write something about yourself"
                                        multiline
                                        name="about"
                                        rows={4}
                                        onChange={handleEditChange}
                                        value={details.about}
                                        style={{ width: '100%' }}
                                        sx={inputs}
                                    />
                                    <Grid>
                                        <Box className={classes.addGoals}>
                                            <input
                                                onChange={(e) => {
                                                    setNewGoal(
                                                        e.target.value === ''
                                                            ? null
                                                            : e.target.value
                                                    );
                                                }}
                                                placeholder='Goal'
                                                type="text"
                                                value={newGoal || ''}
                                            />
                                            <IconButton
                                                onClick={addGoalHandlerNew}
                                                aria-label="delete"
                                                color="primary"
                                            >
                                                <AddIcon />
                                            </IconButton>
                                        </Box>
                                        {editGoals.map((g, index) => (
                                            <Chip
                                                key={index}
                                                label={g}
                                                variant="outlined"
                                                style={{ margin: '1em' }}
                                                size="small"
                                                onDelete={() =>
                                                    handleDelete(index)
                                                }
                                            />
                                        ))}
                                    </Grid>

                                    <Typography color="error">
                                        {error}
                                    </Typography>
                                    <Box
                                        style={{
                                            width: '100%',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Button
                                            variant="contained"
                                            color="error"
                                            onClick={handleClose}
                                        >
                                            Close
                                        </Button>

                                        {loading ? (
                                            <CircularProgress />
                                        ) : (
                                            <Button
                                                variant="contained"
                                                onClick={handleSubmit}
                                            >
                                                Submit
                                            </Button>
                                        )}
                                    </Box>
                                </Box>
                            </Dialog>
                        </Grid>
                    ) : (
                        <NewConnection
                            currentuser={user}
                            profile={props.user}
                        />
                    )}
                </Grid>

                {/* Calander  */}
                <Box className={classes.Calendar}>
                    <MainCalendar selectDateHandler={selectHandler} />
                </Box>
            </Box>

            <Box
                style={{
                    width: '100%',
                }}
            >
                <Tabs
                    value={value}
                    onChange={handleTabChange}
                    aria-label="basic tabs example"
                    centered
                    style={{
                        margin: 'auto 1rem',
                    }}
                >
                    <Tab label="Roadmaps" />
                    {isEditable ? <Tab label="Connections" /> : null}
                    {isEditable ? <Tab label="Pending" /> : null}
                    {isEditable ? <Tab label="Received" /> : null}
                </Tabs>
                <TabPanel value={value} index={0}>
                    <YourRoadmaps
                        modalClick={createRoadmapHandler}
                        user={props.user}
                        isEditable={isEditable}
                    />
                </TabPanel>
                {isEditable ? (
                    <TabPanel value={value} index={1}>
                        <Connections user={props.user} />
                    </TabPanel>
                ) : null}
                {isEditable ? (
                    <TabPanel value={value} index={2}>
                        <Pending user={props.user} />
                    </TabPanel>
                ) : null}
                {isEditable ? (
                    <TabPanel value={value} index={3}>
                        <Requests user={props.user} />
                    </TabPanel>
                ) : null}
            </Box>
            {/* RoadMap  */}
        </Box>
    );
};

export default Panel;
