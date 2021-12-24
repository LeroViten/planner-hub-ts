import { makeStyles } from '@material-ui/core';
import { useDeleteContactMutation } from '../redux/contacts/contactSlice';
import { yellow, green, pink, blue } from '@material-ui/core/colors';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import DeleteOutlined from '@material-ui/icons/DeleteOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import Avatar from '@material-ui/core/Avatar';
import WobbleHover from '../operations/WobbleHover'; // custom hover animation with springs
import ScaleHover from '../operations/ScaleHover'; // custom hover animation with springs
import { useHistory } from 'react-router';

const useStyles = makeStyles({
  avatar: {
    backgroundColor: contact => {
      if (contact.category === 'work') {
        return yellow[700];
      }
      if (contact.category === 'family') {
        return green[500];
      }
      if (contact.category === 'friends') {
        return pink[500];
      }
      return blue[500];
    },
  },
});

export default function ContactCard({ contact }) {
  const [deleteContact, { isLoading: deleting }] = useDeleteContactMutation();
  const classes = useStyles(contact);
  const history = useHistory();

  const handleEditContact = id => {
    history.push(`/edit-contact/${id}`);
  };

  return (
    <>
      <ScaleHover value={1.02} timing={200}>
        <Card elevation={1}>
          <CardHeader
            avatar={
              <Avatar className={classes.avatar}>
                {contact.name[0].toUpperCase()}
              </Avatar>
            }
            action={
              <>
                <WobbleHover rotation={20} timing={200}>
                  <IconButton onClick={() => handleEditContact(contact.id)}>
                    <EditOutlinedIcon />
                  </IconButton>
                </WobbleHover>
                <WobbleHover rotation={20} timing={200}>
                  <IconButton onClick={() => deleteContact(contact.id)}>
                    {deleting ? (
                      <DeleteForeverOutlinedIcon sx={{ color: pink[500] }} />
                    ) : (
                      <DeleteOutlined />
                    )}
                  </IconButton>
                </WobbleHover>
              </>
            }
            title={<b>{contact.name}</b>}
            // subheader={<b>{contact.category}</b>}
          />
          <CardContent>
            <Typography variant="body2" color="textSecondary">
              Phone number: <b>{contact.number}</b>
            </Typography>
          </CardContent>
        </Card>
      </ScaleHover>
    </>
  );
}
