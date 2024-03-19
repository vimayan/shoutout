import * as React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import MoreVertIcon from "@mui/icons-material/MoreVert";

export default function Shout(props) {

  return (
    <Card sx={{width:'inherit'}}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            {props.shouter['username'].toUpperCase()}
          </Avatar>
        }
        action={
          <IconButton aria-label="settings" onClick = {(event)=>{
            event.stopPropagation();}}>
            <MoreVertIcon />
          </IconButton>
        }
        title={props.shouter['username']}
        subheader={new Date(props.createdAt).toString().split('G')[0]}
      />

      <CardContent>
        <Typography variant="body2" color="text.secondary">
         {props.shout}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites"  onClick = {(event)=>{
          event.stopPropagation();
          props.add_like(props['_id'])}}>
          <FavoriteIcon/>{props.like>0?props.like:''}
        </IconButton>
        <IconButton aria-label="share" onClick = {(event)=>{
          event.stopPropagation();}} >
          <ShareIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
}
