import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { Typography } from "@mui/material";
import TitleBar from "./TitleBar";
import { useNavigate } from "react-router-dom";


interface EventItemProps {
  // key: number;
  callback: () => void;
  text: string;
};


function EventItem(props: EventItemProps) {
  const backgroundColor = '#808080';
  const hoverColor = '#606060';

  return (
    <Grid item>
      <Paper
        sx={{
          height: 140,
          width: 140,
          backgroundColor: backgroundColor,
        }}
        // configure hover effect
        elevation={3}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = hoverColor;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = backgroundColor;
        }}
        onClick={props.callback}
      >
        {/* Put the text at the lower center of paper */}
        <Grid
          container
          sx={{ height: '100%' }}
          justifyContent='center'
          alignItems='center'
        >
          <Grid item>
            <Typography
              color="white"
            >
              {props.text}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
}


export default function Main() {
  const navigate = useNavigate();

  return (
    <>
      <Grid
        /* slight margin between top of window and top of grid */
        sx={{ marginTop: 0.25, flexGrow: 1, marginLeft: 0.25, marginRight: 0.25 }}
        container
        spacing={2}
        width="99%"
        height="99%"
      >
        <Grid item xs={12} sx={{ textAlign: 'center' }}>
          <Typography
            // text color is white
            color="white"
          >
            Events
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={1}>
            <EventItem
              callback={() => { navigate('/add-event') }}
              text="Fart"
            />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}