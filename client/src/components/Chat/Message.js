import {
    Avatar,
    Card,
    CardContent,
    CardHeader,
    CardActionArea,
    Grid,
    Typography,
    Badge,
} from '@mui/material';
import { Box } from '@mui/system';

const Message = (props) => {
    return (
        <Box
            style={{
                display: 'flex',
                alignSelf: `${props.other ? 'flex-start' : 'flex-end'}`,
                maxWidth: '70%',
            }}
        >
            {props.other && (
                <Avatar
                    src={props.avatar}
                    style={{
                        width: '20px',
                        height: '20px',
                        margin: '5px',
                        alignSelf: 'flex-start',
                    }}
                ></Avatar>
            )}

            <Card
                sx={{
                    bgcolor: 'primary.main',
                    color: 'white',
                    position: 'relative',
                    minWidth: '5rem',
                    backgroundColor: '#5C5470',
                }}
            >
                <CardContent>
                    <Typography variant="p">{props.content}</Typography>
                </CardContent>
                <Typography
                    variant="p"
                    style={{
                        alignSelf: 'flex-end',
                        fontSize: '0.7rem',
                        position: 'absolute',
                        right: '5px',
                        bottom: '5px',
                        color: '#aaaaaa',
                    }}
                >
                    {props.timestamp}
                </Typography>
            </Card>
        </Box>
    );
};

export default Message;
