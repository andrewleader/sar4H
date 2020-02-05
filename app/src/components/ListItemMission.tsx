import * as React from 'react';
import { Link as RouterLink, useRouteMatch } from 'react-router-dom';
import { IIncidentListItem } from '../api/responses';
import { Link, Card, CardActionArea, CardContent, Typography } from '@material-ui/core';
import MissionListItemModel from '../models/missionListItemModel';

const ListItemMission = (props: {
  mission: MissionListItemModel
}) => {
  let { path, url } = useRouteMatch();

  return (
    <Link underline="none" to={`${url}/${props.mission.id}`} component={RouterLink}>
      <Card>
        <CardActionArea>
          <CardContent>
            <Typography variant="h5">
              {props.mission.title}
            </Typography>
            <Typography>
              {props.mission.date?.toString()}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Link>
  );
}

export default ListItemMission;