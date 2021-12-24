import React, { useState, useEffect } from 'react';
import {
  useEditNoteMutation,
  useFetchNotesQuery,
} from '../redux/notes/noteSlice';
import { toast } from 'react-hot-toast';
import { useHistory } from 'react-router-dom';
import { useParams } from 'react-router';
import { makeStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import TextField from '@material-ui/core/TextField';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
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

export default function CreateNote() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [category, setCategory] = useState('money');
  const classes = useStyles();
  const history = useHistory();
  const [editNote, { isLoading: updating }] = useEditNoteMutation();
  const { data } = useFetchNotesQuery();
  const { id } = useParams();
  const editedNote = notes.find(note => note.id.toString() === id);

  useEffect(() => {
    (async () => {
      await data;
      if (data) {
        setNotes(data);
      }
    })();
  }, [data]);

  useEffect(() => {
    if (editedNote) {
      setTitle(editedNote.title);
      setDetails(editedNote.details);
      setCategory(editedNote.category);
    }
  }, [editedNote, setTitle, setDetails, setCategory]);

  const handleChange = e => {
    const { name, value } = e.target;

    switch (name) {
      case 'title':
        setTitle(value);
        break;

      case 'details':
        setDetails(value);
        break;

      default:
        return;
    }
  };

  const handleSubmit = e => {
    e.preventDefault();

    const updatedNote = {
      id,
      title,
      details,
      category,
    };

    if (title === '') {
      toast.error('Title cannot be empty!', {
        duration: 3000,
        icon: '🤷‍♂️',
        style: {
          border: '1px solid tomato',
          color: '#b00b69',
        },
      });
    }

    if (details === '') {
      toast.error('Number cannot be empty!', {
        duration: 3000,
        icon: '🤷‍♂️',
        style: {
          border: '1px solid tomato',
          color: '#b00b69',
        },
      });
    }

    if (title && details) {
      editNote(updatedNote);
      e.currentTarget.reset();

      toast.success('Note added', {
        duration: 3000,
        icon: '📝',
        style: {
          border: '1px solid green',
          color: '#69b00b',
        },
      });
      history.push('/notes');
    }
  };

  return (
    <Container size="sm">
      <Typography
        variant="h6"
        color="textSecondary"
        component="h2"
        gutterBottom
      >
        Update a Note
      </Typography>

      <form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <TextField
          className={classes.field}
          label="Note Title"
          name="title"
          type="text"
          value={title}
          onChange={handleChange}
          variant="outlined"
          color="secondary"
          // fullWidth
          required
        />
        <TextField
          className={classes.field}
          label="Details"
          name="details"
          value={details}
          onChange={handleChange}
          type="text"
          variant="outlined"
          color="secondary"
          multiline
          rows={4}
          // fullWidth
          required
        />

        <FormControl className={classes.field}>
          <FormLabel>Note Category</FormLabel>
          <RadioGroup
            value={category}
            onChange={e => setCategory(e.target.value)}
          >
            <FormControlLabel
              value="money"
              control={<Radio />}
              label="Money"
              name="radio"
            />
            <FormControlLabel
              value="todos"
              control={<Radio />}
              label="Todos"
              name="radio"
            />
            <FormControlLabel
              value="reminders"
              control={<Radio />}
              label="Reminders"
              name="radio"
            />
            <FormControlLabel
              value="work"
              control={<Radio />}
              label="Work"
              name="radio"
            />
          </RadioGroup>
        </FormControl>

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
                className="Loader"
                type="ThreeDots"
                color="blue"
                height={20}
                width={24}
              />
            )}
            Submit
          </Button>
        </MoveRightHover>
      </form>
    </Container>
  );
}
