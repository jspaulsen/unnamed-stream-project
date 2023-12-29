import { useDispatch } from "react-redux";
import { TwitchClient } from "./clients/Twitch";
import { getClientId, getTwitchAccessToken, getUserId } from "./slices/Auth";
import { getRewards, RewardState, setRewards } from "./slices/Rewards";
import { FormControl, Grid, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Label } from "@mui/icons-material";
import React from "react";


interface LabeledDropdownProps {
  label: string;
  options: string[];
  value: string;
  setValue: (val: string) => void;
}

function LabeledDropdown(props: LabeledDropdownProps) {
  const id = `labeled-dropdown-${props.label}`;

  return (
      <Grid 
        item 
        xs={3}
        // align left
        sx={{ textAlign: 'left' }}
      >
        <FormControl variant="standard" sx={{ minWidth: 120 }}>
          <InputLabel id={id}>{props.label}</InputLabel>
          <Select
            labelId={id}
            id={id}
            value={props.value || props.options[0]}
            onChange={(e) => {
              props.setValue(e.target.value as string);
            }}
            label={props.label} 
          >
            {props.options.map((option) => {
              return (
                <MenuItem value={option} key={option}>{option}</MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Grid>
  );
}

export default function AddEvent() {
  const rewardState: RewardState = getRewards();
  const events = [
    'Reward',
    'Chat Command',
  ];

  // const dispatch = useDispatch();

  const [onEvent, setOnEvent] = React.useState<string>(events[0]);
  const [reward, setReward] = React.useState<string>("");
  const renderReward = onEvent === events[0];

  // render a list of the rewards
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
            // h1 variant
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
          {
            renderReward ?
            <LabeledDropdown
              label="Reward"
              options={rewardState.rewards.map((reward) => {
                return reward.title;
              })}
              value={reward}
              setValue={setReward}
            /> :
            <></>
          }
        </Grid>
    </>
  );
}