import { useEffect, Suspense, lazy } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import { Toaster } from 'react-hot-toast';
import { authSelectors } from './redux/auth';
import { refreshCredentials } from './redux/auth/authSlice';
import { useFetchUserQuery } from './redux/auth/authApi';
import Loader from 'react-loader-spinner';
import { blue } from '@material-ui/core/colors';
import { PrivateRoute } from './components/PrivateRoute';
import { PublicRoute } from './components/PublicRoute';
import Layout from './components/Layout';
import Register from './pages/Register';
import Login from './pages/Login';
import Weather from './pages/Weather';
import NotFoundPage from './pages/NotFoundPage';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';

const HomePage = lazy(
  () => import('./pages/HomePage' /* webpackChunkName: "homepage" */)
);
const Contacts = lazy(
  () => import('./pages/Contacts' /* webpackChunkName: "contacts" */)
);
const CreateContact = lazy(
  () => import('./pages/CreateContact' /* webpackChunkName: "create-contact" */)
);
const EditContact = lazy(
  () => import('./pages/EditContact' /* webpackChunkName: "edit-contact" */)
);
const Notes = lazy(
  () => import('./pages/Notes' /* webpackChunkName: "notes" */)
);
const CreateNote = lazy(
  () => import('./pages/CreateNote' /* webpackChunkName: "create-note" */)
);
const EditNote = lazy(
  () => import('./pages/EditNote' /* webpackChunkName: "edit-note" */)
);

const theme = createTheme({
  palette: {
    primary: {
      main: '#fefefe',
    },
    secondary: blue,
  },
  typography: {
    fontFamily: 'Quicksand',
    fontWeightLight: 400,
    fontWeightRegular: 500,
    fontWeightMedium: 600,
    fontWeightBold: 700,
  },
});

function App() {
  const dispatch = useDispatch();
  const token = useSelector(authSelectors.getToken);

  const { data: user } = useFetchUserQuery(token, {
    skip: token === null,
  });

  useEffect(() => {
    (async () => {
      await user;
      if (user) {
        dispatch(refreshCredentials(user));
      }
    })();
  }, [user, dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Layout>
          <Suspense
            fallback={
              <Loader
                // className="Loader"
                type="Puff"
                color="#77d5f1"
                height={100}
                width={100}
              />
            }
          >
            <Switch>
              <PublicRoute exact path="/" restricted redirectTo="/contacts">
                <HomePage />
              </PublicRoute>
              <PublicRoute exact path="/register" restricted>
                <Register />
              </PublicRoute>
              <PublicRoute
                exact
                path="/login"
                restricted
                redirectTo="/contacts"
              >
                <Login />
              </PublicRoute>
              <PrivateRoute exact path="/contacts" redirectTo="/login">
                <Contacts />
              </PrivateRoute>
              <PrivateRoute exact path="/create-contact">
                <CreateContact />
              </PrivateRoute>
              <PrivateRoute exact path="/edit-contact/:id">
                <EditContact />
              </PrivateRoute>
              <PrivateRoute exact path="/notes">
                <Notes />
              </PrivateRoute>
              <PrivateRoute exact path="/create-note">
                <CreateNote />
              </PrivateRoute>
              <PrivateRoute exact path="/edit-note/:id">
                <EditNote />
              </PrivateRoute>
              <PrivateRoute exact path="/weather">
                <Weather />
              </PrivateRoute>
              <Route>
                <NotFoundPage />
              </Route>
            </Switch>
          </Suspense>
        </Layout>
      </Router>
      <div>
        <Toaster position="top-center" />
      </div>
    </ThemeProvider>
  );
}

export default App;
