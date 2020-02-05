import * as React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Link, Card, CardActionArea, CardContent, Typography, makeStyles } from '@material-ui/core';

const TopLevelCard = (props: {
  text: string,
  href: string
}) => {

  return (
    <Link underline="none" to={props.href} component={RouterLink}>
      <Card>
        <CardActionArea>
          <CardContent>
            <Typography variant="h5">
              {props.text}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Link>
  );
}

export default TopLevelCard;