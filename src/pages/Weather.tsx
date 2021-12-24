import { useState } from 'react';
import { makeStyles } from '@material-ui/core';
import { useSpring, animated } from 'react-spring';
import { useGetWeatherByNameQuery } from '../redux/weather/weatherSlice';
import Loader from 'react-loader-spinner';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import MoveRightHover from '../operations/MoveRightHover';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';

const useStyles = makeStyles({
  field: {
    marginBottom: 10,
    display: 'block',
  },
});

export default function Weather() {
  const classes = useStyles();
  const [city, setCity] = useState('');
  const { data, isFetching, isError } = useGetWeatherByNameQuery(city, {
    skip: city === '',
  });

  const pagesAnimProps = useSpring({
    from: {
      opacity: 0,
      transform: 'translate(-1000px, 0px)',
    },
    to: { opacity: 1, transform: 'translate(0px,0px)' },
  });

  const animProps = useSpring({
    to: { opacity: 1 },
    from: { opacity: 0 },
    delay: 1000,
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCity(e.currentTarget.citySearch.value);
    e.currentTarget.reset();
  };

  const showNotFoundError = isError;
  const showWeatherData = data && !isFetching && !isError;

  return (
    <Container>
      <animated.div style={pagesAnimProps}>
        {isFetching && (
          <Loader
            // className="Loader"
            type="Puff"
            color="blue"
            height={100}
            width={100}
          />
        )}
        <form autoComplete="off" onSubmit={handleSubmit}>
          <TextField
            className={classes.field}
            label="Search"
            name="citySearch"
            type="text"
            variant="outlined"
            color="secondary"
            // fullWidth
            helperText="Type a city name"
          />
          <MoveRightHover x={5} timing={200}>
            <Button
              type="submit"
              disabled={isFetching}
              variant="contained"
              endIcon={<KeyboardArrowRightIcon />}
            >
              {isFetching && (
                <Loader
                  // className="Loader"
                  type="ThreeDots"
                  color="#77d5f1"
                  height={20}
                  width={24}
                />
              )}
              Find
            </Button>
          </MoveRightHover>
        </form>

        {showNotFoundError && (
          <animated.h2 style={animProps}>
            Whoops, no city with the <i>{city}</i> name found! 😢
          </animated.h2>
        )}

        {showWeatherData && (
          <animated.div className="weatherCard" style={animProps}>
            <h1>Here's weather for {data.name}</h1>
            <img
              className="weatherIcon"
              src={`https://openweathermap.org/img/w/${data.weather[0].icon}.png`}
              alt="weather icon"
            />
            <p>Forecast: {data.weather[0].main}</p>
            <p>Temperature: {Math.round(data.main.temp - 273.15)} °C</p>
            <p>Humidity: {data.main.humidity}</p>
            <p>Wind Speed: {data.wind.speed} km/h</p>
            <p>
              Sunrise:{' '}
              {new Date(data.sys.sunrise * 1000).toLocaleTimeString('ru-RU')}
            </p>
            <p>
              Sunset:{' '}
              {new Date(data.sys.sunset * 1000).toLocaleTimeString('ru-RU')}
            </p>
          </animated.div>
        )}
      </animated.div>
    </Container>
  );
}
