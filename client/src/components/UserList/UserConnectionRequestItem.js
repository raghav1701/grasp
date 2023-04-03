import { Avatar, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';
import Chip from '@mui/material/Chip';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Icon from '@mui/material/Icon';
import Tooltip from '@mui/material/Tooltip';

const UserConnectionRequestItem = (props) => {
    const { index, curuser, type, handleAccept, handleDecline } = props;

    return (
        <ListItem divider>
            <Link
                key={index}
                style={{ textDecoration: 'none', flexGrow: 1 }}
                to={`/profile/${curuser.username}`}
            >
                <ListItemIcon>
                    <Avatar src={curuser.avatar} style={{ marginTop: '8px' }} />
                    <ListItemText
                        primary={curuser.username}
                        secondary={curuser.name}
                        style={{ paddingLeft: '20px' }}
                    />
                </ListItemIcon>
            </Link>
            {type === 'Pending' ? (
                <Chip
                    label={'Pending'}
                    size="small"
                    style={{
                        backgroundColor: 'orange',
                        color: 'white',
                    }}
                />
            ) : (
                <>
                    <Tooltip title="Decline">
                        <Icon
                            style={{
                                color: 'red',
                                fontSize: '2rem',
                                marginRight: '1rem',
                                cursor: 'pointer',
                            }}
                            onClick={(e) => {
                                handleDecline(e, curuser);
                            }}
                        >
                            highlight_off
                        </Icon>
                    </Tooltip>
                    <Tooltip title="Accept">
                        <Icon
                            style={{
                                color: 'green',
                                fontSize: '2rem',
                                cursor: 'pointer',
                            }}
                            onClick={(e) => {
                                handleAccept(e, curuser);
                            }}
                        >
                            check_circle
                        </Icon>
                    </Tooltip>
                </>
            )}
        </ListItem>
    );
};

export default UserConnectionRequestItem;
