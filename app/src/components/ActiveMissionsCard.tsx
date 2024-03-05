import { Card, CardActionArea, CardContent, Link, Typography } from '@mui/material';
import * as React from 'react';
import { Link as RouterLink } from 'react-router-dom';

const ActiveMissionsCard = (props: {
  count: number,
  href: string
}) => {

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