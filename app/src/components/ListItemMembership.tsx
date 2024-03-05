import { Card, CardActionArea, CardContent, Link, Typography } from '@mui/material';
import * as React from 'react';
import { Link as RouterLink } from 'react-router-dom';

const ListItemMembership = (props:{ name: string, id: number }) => {
  return (
    <Link underline="none" to={'/' + props.id} component={RouterLink}>
      <Card>
        <CardActionArea>
          <CardContent>
            <Typography variant="h5">
              {props.name}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Link>
  );
}

export default ListItemMembership;