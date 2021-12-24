import { useHistory, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import { format } from 'date-fns';
import { useLogoutUserMutation } from '../redux/auth/authApi';
import { unsetCredentials } from '../redux/auth/authSlice';
import { authSelectors } from '../redux/auth';
import Drawer from '@mui/material/Drawer';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { SubjectOutlined } from '@material-ui/icons/';
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import AuthNav from './AuthNav';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@mui/material/IconButton';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import WobbleHover from '../operations/WobbleHover'; // custom hover animation with springs

const drawerWidth = 210;

const useStyles = makeStyles(theme => {
  return {
    page: {
      background: '#f9f9f9',
      width: '100%',
      padding: theme.spacing(3),
    },
    root: {
      display: 'flex',
    },
    drawer: {
      width: drawerWidth,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    active: {
      background: '#f4f4f4',
    },
    title: {
      padding: theme.spacing(2),
    },
    appBar: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
    date: {
      flexGrow: 1,
    },
    toolbar: theme.mixins.toolbar,
    avatar: {
      marginLeft: theme.spacing(2),
    },
  };
});

export default function Layout({ children }) {
  const name = useSelector(authSelectors.getUserName);
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(authSelectors.getLoggedIn);
  const [logOut] = useLogoutUserMutation();

  const menuItems = [
    {
      text: 'My Contacts',
      icon: <PermContactCalendarIcon color="primary" />,
      path: '/contacts',
    },
    {
      text: 'My Notes',
      icon: <SubjectOutlined color="secondary" />,
      path: '/notes',
    },
    {
      text: 'Weather',
      icon: <WbSunnyOutlinedIcon color="primary" />,
      path: '/weather',
    },
  ];

  return (
    <div className={classes.root}>
      {/* app bar */}
      <AppBar
        position="fixed"
        className={classes.appBar}
        elevation={0}
        color="primary"
      >
        <Toolbar>
          <Typography className={classes.date}>
            {format(new Date(), 'do MMMM Y')}
          </Typography>
          <Typography>{isLoggedIn ? `Hello, ${name}` : <AuthNav />}</Typography>
          {isLoggedIn && (
            <>
              <WobbleHover rotation={20} timing={200}>
                <IconButton
                  aria-label="log out"
                  onClick={async () => {
                    try {
                      const result = await logOut();
                      if (result.data) {
                        dispatch(unsetCredentials());
                      }
                    } catch (err) {
                      console.log(err);
                    }
                  }}
                >
                  <LogoutOutlinedIcon color="secondary" />
                </IconButton>
              </WobbleHover>
            </>
          )}
          {isLoggedIn && (
            <Avatar className={classes.avatar} src="/avatar.jpg" />
          )}
        </Toolbar>
      </AppBar>

      {/* side drawer */}
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{ paper: classes.drawerPaper }}
        anchor="left"
      >
        <div>
          <Typography variant="h5" className={classes.title}>
            Planner Hub
          </Typography>
        </div>

        {/* links/list section */}
        <List>
          {isLoggedIn &&
            menuItems.map(item => (
              <ListItem
                button
                key={item.text}
                onClick={() => history.push(item.path)}
                className={
                  location.pathname === item.path ? classes.active : null
                }
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
        </List>
      </Drawer>

      {/* main content */}
      <div className={classes.page}>
        <div className={classes.toolbar}></div>
        {children}
      </div>
    </div>
  );
}
