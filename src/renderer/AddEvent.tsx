import { getRewards, RewardState } from "./slices/Rewards";
import { Button, Grid, Typography } from "@mui/material";
import React from "react";
import LabeledDropdown from "./events/LabeledDropdown";
import RewardRedemption from "./events/RewardRedemption";
import { Chat } from "@mui/icons-material";
import ChatCommand from "./events/ChatCommand";


export default function AddEvent() {
  const events = ['Reward', 'Chat Command'];
  const spotifyActions = ['Enqueue', 'Resume', 'Pause', 'Skip Song', 'Display Next Song'];

  const [onEvent, setOnEvent] = React.useState<string>(events[0]);
  const [reward, setReward] = React.useState<string>("");
  const [command, setCommand] = React.useState<string>("");
  const [spotifyAction, setSpotifyAction] = React.useState<string>(spotifyActions[0]);
  const [error, setError] = React.useState<boolean>(false);

  const renderReward = onEvent === events[0];

  const event = renderReward ? (
    <RewardRedemption
      reward={reward}
      setReward={setReward}
    />
  ) : (
    <ChatCommand
      command={command}
      setCommand={setCommand}
      error={error}
      setError={setError}
    />
  );
  
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
            color="white"
            variant="h3"
          >
            Add New Event
          </Typography>
        </Grid>
        <LabeledDropdown
          label="On Event"
          options={events}
          value={onEvent}
          setValue={setOnEvent}
        />
        {event}
        <LabeledDropdown
          label="Spotify Action"
          options={spotifyActions}
          value={spotifyAction}
          setValue={setSpotifyAction}
        />
        <Grid
          item
          xs={12}
          sx={{ justifyContent: 'center', display: 'flex' }}
        >
          <Button
            variant="contained"
            color='secondary'
            sx={{
              width: '250px',
              fontSize: '1rem',
              display: 'flex',
              marginTop: 10,
            }}
            onClick={() => { }}
          >
            Save
          </Button>
        </Grid>
      </Grid>
    </>
  );
}