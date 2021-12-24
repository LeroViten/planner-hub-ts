import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { makeStyles } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { authSelectors } from '../redux/auth';
import {
  useEditContactMutation,
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

interface IRouteMatch {
  id: string;
}

export default function EditContact() {
  // const [category, setCategory] = useState('family');
  const [contacts, setContacts] = useState<IContacts[]>([]);
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [editContact, { isLoading: updating }] = useEditContactMutation();
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const token = useSelector(authSelectors.getToken);
  const { data: user } = useFetchUserQuery(token, {
    skip: token === null,
  });
  const { data } = useFetchContactsQuery({
    pollingInterval: 3000,
    refetchOnMountOrArgChange: true,
    skip: false,
  });
  const { id } = useParams<IRouteMatch>();
  const editedContact = contacts.find(
    (contact) => contact.id.toString() === id
  );

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

  useEffect(() => {
    if (editedContact) {
      setName(editedContact.name);
      setNumber(editedContact.number);
    }
  }, [editedContact, setName, setNumber]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    switch (name) {
      case 'name':
        setName(value);
        break;

      case 'number':
        setNumber(value);
        break;

      default:
        return;
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const updatedContact = {
      id,
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

    if (name && number) {
      editContact(updatedContact);

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
      <Typography
        variant="h6"
        color="textSecondary"
        component="h2"
        gutterBottom
      >
        Update a Contact
      </Typography>

      <form autoComplete="off" onSubmit={handleSubmit}>
        <TextField
          className={classes.field}
          value={name}
          onChange={handleChange}
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
          value={number}
          onChange={handleChange}
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
            disabled={updating}
            color="secondary"
            variant="contained"
            endIcon={<KeyboardArrowRightIcon />}
          >
            {updating && (
              <Loader
                // className="Loader"
                type="ThreeDots"
                color="blue"
                height={20}
                width={24}
              />
            )}
            Update
          </Button>
        </MoveRightHover>
      </form>
    </Container>
  );
}
