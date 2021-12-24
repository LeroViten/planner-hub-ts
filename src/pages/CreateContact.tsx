import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { makeStyles } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useSpring, animated } from 'react-spring';
import { authSelectors } from '../redux/auth';
import {
  useCreateContactMutation,
  useFetchContactsQuery,
} from '../redux/contacts/contactSlice';
import { useFetchUserQuery } from '../redux/auth/authApi';
import { refreshCredentials } from '../redux/auth/authSlice';
import IContacts from '../interfaces/Contacts.interface';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import TextField from '@material-ui/core/TextField';
// import Radio from '@material-ui/core/Radio';
// import RadioGroup from '@material-ui/core/RadioGroup';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import FormControl from '@material-ui/core/FormControl';
// import FormLabel from '@material-ui/core/FormLabel';
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

export default function CreateContact() {
  // const [category, setCategory] = useState('family');
  const [contacts, setContacts] = useState<IContacts[]>([]);
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const token = useSelector(authSelectors.getToken);
  const { data: user } = useFetchUserQuery(token, {
    skip: token === null,
  });
  const [createContact, { isLoading }] = useCreateContactMutation();
  const { data } = useFetchContactsQuery({
    pollingInterval: 3000,
    refetchOnMountOrArgChange: true,
    skip: false,
  });

  const pagesAnimProps = useSpring({
    from: {
      opacity: 0,
      transform: 'translate(-1000px, 0px)',
    },
    to: { opacity: 1, transform: 'translate(0px,0px)' },
  });

  /* eslint-disable no-useless-escape */
  /* prettier-ignore */
  const phoneRegEx = "\\+?\\d{1,4}?[-.\\s]?\\(?\\d{1,3}?\\)?[-.\\s]?\\d{1,4}[-.\\s]?\\d{1,4}[-.\\s]?\\d{1,9}";

  useEffect(() => {
    (async () => {
      await user;
      if (user) {
        dispatch(refreshCredentials(user));
      }
    })();
  }, [user, dispatch]);

  useEffect(() => {
    (async () => {
      await data;
      if (data) {
        setContacts(data);
      }
    })();
  }, [data]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const target = e.target as typeof e.target & {
      name: { value: string };
      number: { value: string };
    };

    const name = target.name.value;
    const number = target.number.value;

    const newContact = {
      name,
      number,
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

    if (number === '') {
      toast.error('Number cannot be empty!', {
        duration: 3000,
        icon: '🤷‍♂️',
        style: {
          border: '1px solid tomato',
          color: '#b00b69',
        },
      });
    }

    if (
      contacts.find(
        (contact) => name.toLowerCase() === contact.name.toLowerCase()
      )
    ) {
      toast.error('Contact is already in the list', {
        duration: 3000,
        icon: '🤷‍♂️',
        style: {
          border: '1px solid tomato',
          color: '#b00b69',
        },
      });
      e.currentTarget.reset();
      return;
    }

    if (name && number) {
      createContact(newContact);

      e.currentTarget.reset();

      toast.success('Contact added', {
        duration: 3000,
        icon: '🤵',
        style: {
          border: '1px solid green',
          color: '#69b00b',
        },
      });

      history.push('/contacts');
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
          Create a New Contact
        </Typography>

        <form autoComplete="off" onSubmit={handleSubmit}>
          <TextField
            className={classes.field}
            label="Name"
            name="name"
            type="text"
            variant="outlined"
            color="secondary"
            // fullWidth
            required
            helperText="The name can only consist of letters, apostrophe, dash and spaces. For example: Adrian, Jacob Mercer, Charles de Batz de Castelmore d'Artagnan"
            inputProps={{
              pattern:
                "^[a-zA-Zа-яА-Я]+(([' -][a-zA-Zа-яА-Я ])?[a-zA-Zа-яА-Я]*)*$",
            }}
          />
          <TextField
            className={classes.field}
            label="Number"
            name="number"
            type="tel"
            variant="outlined"
            color="secondary"
            // fullWidth
            required
            helperText="Phone number can consist of minimum 8 numbers, brackets, dashes, spaces and start with +"
            inputProps={{
              pattern: phoneRegEx,
            }}
          />

          {/* <FormControl className={classes.field}>
          <FormLabel>Number Category</FormLabel>
          <RadioGroup
            value={category}
            onChange={e => setCategory(e.currentTarget.value)}
          >
            <FormControlLabel
              value="family"
              control={<Radio />}
              label="Family"
              name="radio"
            />
            <FormControlLabel
              value="friends"
              control={<Radio />}
              label="Friends"
              name="radio"
            />
            <FormControlLabel
              value="work"
              control={<Radio />}
              label="Work"
              name="radio"
            />
          </RadioGroup>
        </FormControl> */}

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
              Save
            </Button>
          </MoveRightHover>
        </form>
      </animated.div>
    </Container>
  );
}
