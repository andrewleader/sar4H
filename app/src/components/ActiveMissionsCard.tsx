import * as React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Link, Card, CardActionArea, CardContent, Typography, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  textContainer: {
    display: "flex"
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

const ActiveMissionsCard = (props: {
  count: number,
  href: string
}) => {

  const classes = useStyles();

  return (
    <Link underline="none" to={props.href} component={RouterLink}>
      <Card>
        <CardActionArea>
          <CardContent>
            <Typography variant="h5">
              {props.count >= 0 ? props.count : '--'} active mission{props.count != 1 ? 's' : ''}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Link>
  );
}

export default ActiveMissionsCard;