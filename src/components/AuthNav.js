import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { makeStyles } from '@material-ui/core';
import { authSelectors } from '../redux/auth';
import { Button } from '@material-ui/core';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';

const useStyles = makeStyles({
  authButton: {
    marginRight: 5,
  },
});

export default function AuthNav() {
  const isLoggedIn = useSelector(authSelectors.getLoggedIn);
  const classes = useStyles();
  const history = useHistory();

  return (
    <>
      <Button
        className={classes.authButton}
        variant="contained"
        size="small"
        disabled={isLoggedIn}
        startIcon={<PersonAddOutlinedIcon />}
        onClick={() => history.push('/register')}
      >
        Register
      </Button>
      <Button
        variant="contained"
        size="small"
        disabled={isLoggedIn}
        endIcon={<ExitToAppOutlinedIcon />}
        onClick={() => history.push('/login')}
      >
        Login
      </Button>
    </>
  );
}
