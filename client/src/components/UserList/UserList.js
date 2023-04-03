import {
    Grid,
    Typography,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Avatar,
    LinearProgress,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import EditRoadIcon from '@mui/icons-material/EditRoad';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import UserListItem from './UserListItem';

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
}));

const Demo = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
}));

// props contain
// title
// users
// emptyText
const UserList = (props) => {
    const classes = useStyles();
    return (
        <Grid container className={classes.container}>
            <Grid item xs={12} md={9}>
                <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
                    {`${props.title} (${props.users.length})`}
                </Typography>
                <hr />
                {props.loading ? <LinearProgress color="success" /> : null}
                <Demo>
                    <List>{props.children}</List>
                </Demo>
            </Grid>
        </Grid>
    );
};

export default UserList;
