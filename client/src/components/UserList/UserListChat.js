import { List, Box, LinearProgress } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { styled } from '@mui/material/styles';

const useStyles = makeStyles((theme) => ({
    chatContainer: {
        overflow: 'scroll',
    },
    Date_Class: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
    },
}));

// props contain
// title
// users
// emptyText
const UserListChat = (props) => {
    const classes = useStyles();
    return (
        <List style={{ overflow: 'scroll', height: '80vh', margin: 0 }}>
            {props.children}
        </List>
    );
};

export default UserListChat;
