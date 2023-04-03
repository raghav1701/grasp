import {
    Grid,
    ListItem,
    ListItemIcon,
    ListItemText,
    Button,
    Tooltip,
} from '@mui/material';
import EditRoadIcon from '@mui/icons-material/EditRoad';
import { Link } from 'react-router-dom';
import Chip from '@mui/material/Chip';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import Star from '@mui/icons-material/Star';
import { makeStyles } from '@mui/styles';
import { useState } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';

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

const RoadListItem = (props) => {
    const classes = useStyles();
    const { user, road, handleCloning, handleStars } = props;
    const [stars, setStars] = useState(!road.stars ? 0 : road.stars.length);
    const [clones, setClones] = useState(
        !road.children ? 0 : road.children.length
    );
    const [loading, setLoading] = useState(false);
    const [loadingstars, setLoadingstars] = useState(false);
    var createdate = road.createdAt ? road.createdAt.split('T') : '';

    const handleFork = () => {
        setLoading(true);
        handleCloning(road._id).then((res) => {
            if (!res.error) {
                setClones((prev) => prev + 1);
            }
            setLoading(false);
        });
    };

    const handleStar = () => {
        setLoadingstars(true);
        handleStars(road._id).then((res) => {
            if (!res.error) {
                setStars((prev) => prev + 1);
            }
            setLoadingstars(false);
        });
    };

    return (
        <ListItem divider>
            <Link
                style={{
                    textDecoration: 'none',
                    flexGrow: 1,
                }}
                to={`/roadmap/${road._id}`}
            >
                <Grid>
                    <Grid
                        item
                        style={{ display: 'flex', alignItems: 'center' }}
                    >
                        <ListItemIcon>
                            <EditRoadIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary={road.title}
                            secondary={road.description}
                        />
                    </Grid>
                    <Grid item style={{ marginTop: '1em' }}>
                        {road.tags &&
                            road.tags.map((t, index) => {
                                return (
                                    <Chip
                                        key={index}
                                        label={t.toLowerCase()}
                                        className={classes.chip}
                                        size="small"
                                        style={{
                                            backgroundColor: 'orange',
                                            color: 'white',
                                        }}
                                        // color="warning"
                                    />
                                );
                            })}
                    </Grid>
                    <Grid item>
                        <ListItemText
                            className={classes.Date_Class}
                            secondary={createdate[0]}
                        />
                    </Grid>
                </Grid>
            </Link>
            <Grid
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-around',
                }}
            >
                {user && road.user !== user._id ? (
                    <Tooltip
                        title="Clone"
                        style={{
                            margin: 'auto 1em auto 1em',
                        }}
                    >
                        <LoadingButton
                            startIcon={<FileCopyIcon />}
                            variant="outlined"
                            onClick={handleFork}
                            loading={loading}
                        >
                            {clones}
                        </LoadingButton>
                    </Tooltip>
                ) : null}
                {user && road.user !== user._id ? (
                    <Tooltip
                        title="Star"
                        style={{
                            margin: '1em auto auto 1em',
                        }}
                    >
                        <LoadingButton
                            startIcon={<Star />}
                            variant="outlined"
                            color="warning"
                            onClick={handleStar}
                            loading={loadingstars}
                        >
                            {stars}
                        </LoadingButton>
                    </Tooltip>
                ) : null}
            </Grid>
        </ListItem>
    );
};

export default RoadListItem;
