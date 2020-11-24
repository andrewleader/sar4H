import * as React from 'react';
import { Link as RouterLink, useRouteMatch, useParams } from 'react-router-dom';
import { IActivityListItem } from '../api/responses';
import { Link, Card, CardActionArea, CardContent, Typography, Badge, Grid } from '@material-ui/core';
import ActivityListItemModel from '../models/activityListItemModel';
import PersonIcon from '@material-ui/icons/Person';

const ListItemMission = (props: {
  mission: ActivityListItemModel
}) => {
  let { path, url } = useRouteMatch();
  let { unitId } = useParams();
  
  return (
    
    <Link underline="none" to={`/${unitId}/${props.mission.getPathType()}/${props.mission.id}`} component={RouterLink}>
      <Card>
        <CardActionArea>
          <CardContent>
            <Grid container spacing={2}>

              <Grid item xs>
                <Typography variant="h6">
                  {props.mission.title}
                </Typography>
                <Typography color="textSecondary">
                  {props.mission.getFriendlyDate()}
                </Typography>
              </Grid>

              <Grid item>
                <Badge badgeContent={props.mission.count_attendance} color="primary">
                  <PersonIcon/>
                </Badge>
              </Grid>

            </Grid>
          </CardContent>
        </CardActionArea>
      </Card>
    </Link>
  );
}

export default ListItemMission;