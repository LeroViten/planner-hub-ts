import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import { toast } from 'react-hot-toast';
import { useSpring, animated } from 'react-spring';
import { useCreateUserMutation } from '../redux/auth/authApi';
import { setCredentials } from '../redux/auth/authSlice';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import TextField from '@material-ui/core/TextField';
import Loader from 'react-loader-spinner';
import MoveRightHover from '../operations/MoveRightHover';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';

const useStyles = makeStyles({
  field: {
    marginTop: 20,
    marginBottom: 20,
    display: 'block',
  },
});

export default function Register() {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const [createUser, { isLoading }] = useCreateUserMutation();

  const pagesAnimProps = useSpring({
    from: {
      opacity: 0,
      transform: 'translate(-1000px, 0px)',
    },
    to: { opacity: 1, transform: 'translate(0px,0px)' },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const name = e.currentTarget.username.value;
    const email = e.currentTarget.email.value;
    const password = e.currentTarget.password.value;

    e.preventDefault();

    const newUser = {
      name,
      email,
      password,
    };

    if (name === '') {
      toast.error('Name cannot be empty!', {
        duration: 3000,
        icon: '🤷‍♂️',
        style: {
          border: '1px solid tomato',
          color: '#b00b69',
        },
      });
    }

    if (email === '') {
      toast.error('Email cannot be empty!', {
        duration: 3000,
        icon: '🤷‍♂️',
        style: {
          border: '1px solid tomato',
          color: '#b00b69',
        },
      });
    }

    if (password === '') {
      toast.error('Password cannot be empty!', {
        duration: 3000,
        icon: '🤷‍♂️',
        style: {
          border: '1px solid tomato',
          color: '#b00b69',
        },
      });
    }

    if (name && email && password) {
      try {
        const result = await createUser(newUser);
        if (result) {
          dispatch(setCredentials(result.data));
        }
        toast.success('Registration completed! 🚀', {
          duration: 3000,
          icon: '📝',
          style: {
            border: '1px solid green',
            color: '#69b00b',
          },
        });
        history.push('/');
      } catch (err: any) {
        toast.error(err.message);
      }
    }
  };

  return (
    <Container>
      <animated.div style={pagesAnimProps}>
        <Typography
          variant="h6"
          color="textSecondary"
          component="h2"
          gutterBottom
        >
          Register in a form below:
        </Typography>

        <form noValidate autoComplete="off" onSubmit={handleSubmit}>
          <TextField
            className={classes.field}
            label="Name"
            name="username"
            type="text"
            variant="outlined"
            color="secondary"
            // fullWidth
            required
          />
          <TextField
            className={classes.field}
            label="Email"
            name="email"
            type="email"
            variant="outlined"
            color="secondary"
            // fullWidth
            required
          />

          <TextField
            className={classes.field}
            label="Password"
            name="password"
            type="password"
            variant="outlined"
            color="secondary"
            // fullWidth
            required
          />

          <MoveRightHover x={5} timing={200}>
            <Button
              type="submit"
              disabled={isLoading}
              color="secondary"
              variant="contained"
              endIcon={<KeyboardArrowRightIcon />}
            >
              {isLoading && (
                <Loader
                  // className="Loader"
                  type="ThreeDots"
                  color="blue"
                  height={20}
                  width={24}
                />
              )}
              Register
            </Button>
          </MoveRightHover>
        </form>
      </animated.div>
    </Container>
  );
}
