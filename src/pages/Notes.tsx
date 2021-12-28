import React, { useState, useEffect } from 'react';
import { useFetchNotesQuery } from '../redux/notes/noteSlice';
import { useSpring, animated } from 'react-spring';
import { useHistory } from 'react-router';
import { makeStyles } from '@material-ui/core';
import INotes from '../interfaces/Notes.interface';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Loader from 'react-loader-spinner';
import Container from '@material-ui/core/Container';
import Masonry from 'react-masonry-css';
import NoteCard from '../components/NoteCard';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';

const breakpoints = {
  default: 3,
  1100: 2,
  700: 1,
};

const useStyles = makeStyles({
  fabButton: {
    bottom: '0px !important',
    right: '0px !important',
  },
});

export default function Notes() {
  const [notes, setNotes] = useState<INotes[]>([]);
  const { data, isFetching } = useFetchNotesQuery({
    pollingInterval: 3000,
    refetchOnMountOrArgChange: true,
    skip: false,
  });
  const history = useHistory();
  const classes = useStyles();

  useEffect(() => {
    (async () => {
      await data;
      if (data) {
        setNotes(data);
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

    history.push('/create-note');
  };

  return (
    <Container>
      <animated.div style={pagesAnimProps}>
        {notes === [] && <h1>No notes to show</h1>}
        {isFetching && (
          <Loader
            // className="Loader"
            type="Puff"
            color="#77d5f1"
            height={100}
            width={100}
          />
        )}
        {notes && (
          <Masonry
            breakpointCols={breakpoints}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            {notes.map((note) => (
              <animated.div key={note.id} style={cardsAnimProps}>
                <NoteCard note={note} />
              </animated.div>
            ))}
          </Masonry>
        )}
        <animated.div style={fabAnimProps}>
          <Fab
            aria-label="add note button"
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
