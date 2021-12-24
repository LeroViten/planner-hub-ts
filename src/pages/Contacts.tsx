import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core';
import { useSpring, animated } from 'react-spring';
import { useDispatch, useSelector } from 'react-redux';
import { authSelectors } from '../redux/auth';
import { useFetchUserQuery } from '../redux/auth/authApi';
import { refreshCredentials } from '../redux/auth/authSlice';
import { useFetchContactsQuery } from '../redux/contacts/contactSlice';
import IContacts from '../interfaces/Contacts.interface';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Loader from 'react-loader-spinner';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Masonry from 'react-masonry-css';
import ContactCard from '../components/ContactCard';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import { useHistory } from 'react-router';

const breakpoints = {
  default: 3,
  1100: 2,
  700: 1,
};

const useStyles = makeStyles({
  field: {
    marginBottom: 10,
    display: 'block',
  },
  fabButton: {
    bottom: '0px !important',
    right: '0px !important',
  },
});

export default function Contacts() {
  const [contacts, setContacts] = useState<IContacts[]>([]);
  const [filter, setFilter] = useState('');
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const token = useSelector(authSelectors.getToken);

  const { data: user } = useFetchUserQuery(token, {
    skip: token === null,
  });

  const { data, isFetching } = useFetchContactsQuery({
    pollingInterval: 3000,
    refetchOnMountOrArgChange: true,
    skip: false,
  });

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

  const pagesAnimProps = useSpring({
    from: {
      opacity: 0,
      transform: 'translate(-1000px, 0px)',
    },
    to: { opacity: 1, transform: 'translate(0px,0px)' },
  });

  const cardsAnimProps = useSpring({
    to: { opacity: 1 },
    from: { opacity: 0 },
    delay: 1000,
  });

  const fabAnimProps = useSpring({
    to: { opacity: 1 },
    from: { opacity: 0 },
    delay: 2000,
  });

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();

    history.push('/create-contact');
  };

  const getVisibleContacts = () => {
    const normalizedFilter = filter.toLowerCase();

    return contacts.filter((contact) =>
      contact.name.toLowerCase().includes(normalizedFilter)
    );
  };

  const visibleContacts = getVisibleContacts();

  return (
    <Container>
      <animated.div style={pagesAnimProps}>
        {contacts === [] && <h1>No contacts to show</h1>}
        {isFetching && (
          <Loader
            // className="Loader"
            type="Puff"
            color="#77d5f1"
            height={100}
            width={100}
          />
        )}
        <TextField
          className={classes.field}
          label="Search"
          name="search"
          type="text"
          variant="standard"
          color="secondary"
          autoComplete="off"
          // fullWidth
          helperText="Type a name to find"
          onChange={(e) => setFilter(e.currentTarget.value)}
        />
        {contacts && (
          <Masonry
            breakpointCols={breakpoints}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            {visibleContacts.map((contact) => (
              <animated.div key={contact.id} style={cardsAnimProps}>
                <ContactCard contact={contact} />
              </animated.div>
            ))}
          </Masonry>
        )}
        <animated.div style={fabAnimProps}>
          <Fab
            aria-label="add contact button"
            color="primary"
            className={classes.fabButton}
            onClick={handleClick}
          >
            <AddIcon />
          </Fab>
        </animated.div>
      </animated.div>
    </Container>
  );
}
