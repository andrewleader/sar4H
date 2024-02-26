import { Card, CardActionArea, CardContent, Link, Typography } from '@mui/material';
import * as React from 'react';
import { Link as RouterLink } from 'react-router-dom';

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