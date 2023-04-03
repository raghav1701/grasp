import {
    Avatar,
    Button,
    Chip,
    Grid,
    IconButton,
    ListItem,
    ListItemIcon,
    ListItemText,
    Tooltip,
} from '@mui/material';
import { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import ChatIcon from '@mui/icons-material/Chat';

const UserListItem = (props) => {
    const { index, curuser, type } = props;
    const history = useHistory();
    const [user, setUser] = useContext(UserContext);

    const handleClick = (e) => {
        history.push('/chat', { chatUser: curuser });
    };

    return (
        <ListItem key={index} divider>
            <Link
                to={`/profile/${curuser.username}`}
                style={{
                    textDecoration: 'none',
                    flexGrow: 1,
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                <ListItemIcon>
                    <Avatar src={curuser.avatar} />
                </ListItemIcon>
                <ListItemText
                    primary={curuser.username}
                    secondary={curuser.name}
                />
                {/* {type
                    ? user.goals.map((g, index) => {
                          return (
                              <Chip
                                  key={index}
                                  label={g}
                                  style={{
                                      margin: '0.2em',
                                      backgroundColor: '#D2B48C',
                                  }}
                                  size="small"
                              />
                          );
                      })
                    : null} */}
            </Link>
            {user && curuser.connections.includes(user._id) ? (
                // <Link style={{ textDecoration: 'none' }} to={`/chat`}>
                <Tooltip title="Message">
                    <IconButton
                        onClick={handleClick}
                        variant="contained"
                        color="success"
                        size="small"
                    >
                        <ChatIcon />
                    </IconButton>
                </Tooltip>
            ) : // </Link>
            null}
        </ListItem>
    );
};

export default UserListItem;
