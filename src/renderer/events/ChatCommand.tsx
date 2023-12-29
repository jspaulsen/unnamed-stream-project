import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import styled from "@emotion/styled";


interface ChatCommandOpts {
    command: string;
    setCommand: (command: string) => void;
    error: boolean;
    setError: (error: boolean) => void;
}


const WhiteBorderTextField = styled(TextField)`
  & label.Mui-focused {
    color: white;
  }
  & .MuiOutlinedInput-root {
    &.Mui-focused fieldset {
      border-color: white;
    }
  }
`;


export default function ChatCommand(props: ChatCommandOpts) {
  return (
    <Grid
        item
        xs={3}
        // align left
        sx={{ textAlign: 'left' }}
    >
        <WhiteBorderTextField
            error={props.error}
            label="Command"
            variant="standard"
            color="secondary"
            value={props.command}
            onChange={(e) => {
                props.setCommand(e.target.value);

                if (e.target.value.length > 0) {
                    props.setError(false);
                } else {
                    props.setError(true);
                }
            }}
            sx={{
                width: '50%',
                input: {
                    color: 'white', 
                },
                fieldset: {
                    borderColor: 'white',
                }
            }}
            helperText={props.error ? "Command cannot be empty" : ""}
        />
    </Grid>
  );
}