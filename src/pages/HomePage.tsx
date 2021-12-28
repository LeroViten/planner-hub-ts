import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import Weather from './Weather';

const useStyles = makeStyles(theme => {
  return {
    title: {
      padding: theme.spacing(2),
    },
  };
});

export default function HomePage() {
  const classes = useStyles();
  return (
    <>
      <Typography className={classes.title} variant="h3">
        This is your HomePage
      </Typography>
      <Typography className={classes.title}>
        You need to register or login into your account to get the best
        experience 😉
      </Typography>
      <Typography className={classes.title}>
        Spoiler Alert! 🌟 You can still get the weather forecast below. Just
        enter any city name!
      </Typography>
      <Weather />
    </>
  );
}
