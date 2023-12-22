import Grid from "@mui/material/Grid";
import { getAuthState } from "./slices/Auth";
import Paper from "@mui/material/Paper";
import { Typography } from "@mui/material";
import TitleBar from "./TitleBar";


function EventItem (key: any, props: { key: any;}) {
    const backgroundColor = '#808080';
    const hoverColor = '#606060';

    return (
        <Grid key={props.key} item>
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
            >
                {/* Put the text at the lower center of paper */}
                <Grid container sx={{ height: '100%' }} alignItems="flex-end" justifyContent="center">
                    <Grid item>
                        <Typography
                            color="white"
                        >
                            Event
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>
        </Grid>
    );
}


export default function Main() {
    const authState = getAuthState();
    
    // generate a list from 0 - 100
    const list = [...Array(25).keys()];
    
    return (
        <>
        <TitleBar />
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
                    {list.map((value) => (
                        <EventItem key={value} />
                    ))}
                </Grid>
            </Grid>
        </Grid>
        </>
    );
}