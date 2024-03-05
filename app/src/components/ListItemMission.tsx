import * as React from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { IActivityListItem } from '../api/responses';
import ActivityListItemModel from '../models/activityListItemModel';
import { Badge, Card, CardActionArea, CardContent, Grid, Link, Typography } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';

const ListItemMission = (props: {
  mission: ActivityListItemModel
}) => {
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