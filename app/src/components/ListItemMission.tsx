import * as React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { IIncidentListItem } from '../api/responses';
import { Link, Card, CardActionArea, CardContent, Typography } from '@material-ui/core';
import MissionListItemModel from '../models/missionListItemModel';

const ListItemMission = (props: {
  indident: MissionListItemModel
}) => {

  return (
    <Link underline="none" to={'/' + props.indident.id} component={RouterLink}>
      <Card>
        <CardActionArea>
          <CardContent>
            <Typography variant="h5">
              {props.indident.title}
            </Typography>
            <Typography>
              {props.indident.date?.toString()}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Link>
  );
}

export default ListItemMission;