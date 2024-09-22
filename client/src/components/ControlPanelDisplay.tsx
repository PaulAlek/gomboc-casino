import { Box, Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";

interface ControlPanelDisplayProps {
    balance: number;
    betAmount: string;
    setBetAmount: (value: string) => void;
    amountError: boolean;
    handleAmountChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    guessSelection: string;
    handleGuessChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: () => void;
    handleWithdraw: () => void;
    numberOfWins: number;
    betResult: string;
}
const ControlPanelDisplay: React.FC<ControlPanelDisplayProps> = ({
    balance,
    betAmount,
    setBetAmount,
    amountError,
    handleAmountChange,
    guessSelection,
    handleGuessChange,
    handleSubmit,
    handleWithdraw,
    numberOfWins,
    betResult,
}) => {
    function winnerOrLoser(result: string) {
        if (result === "win") {
            return "Bet Result: You won!";
        } else if (result === "lose") {
            return "Bet Result: You Lost :(";
        } else {
            return "Guess to Play";
        }
    }
    return (
        <Box width="100%">
            <Typography
                variant="h5"
                component="div"
                alignItems="center"
                justifyContent="center"
            >
                {winnerOrLoser(betResult)}
            </Typography>

            <Typography variant="body1" mb="10px">
                Balance: {balance}
            </Typography>
            <TextField
                label="Amount"
                id="outlined-size-small"
                value={betAmount}
                onChange={handleAmountChange}
                error={amountError}
                helperText={
                    amountError ? "Please enter a valid positive number " : ""
                }
                fullWidth
            />

            <FormControl>
                <FormLabel id="select-number">Guess Selection</FormLabel>
                <RadioGroup
                    aria-labelledby="select-number"
                    name="guess-options"
                    value={guessSelection}
                    onChange={handleGuessChange}
                >
                    <Stack direction="row" spacing={2}>
                        <FormControlLabel
                            value="1"
                            control={<Radio />}
                            label="1"
                            labelPlacement="bottom"
                        />
                        <FormControlLabel
                            value="2"
                            control={<Radio />}
                            label="2"
                            labelPlacement="bottom"
                        />
                        <FormControlLabel
                            value="3"
                            control={<Radio />}
                            label="3"
                            labelPlacement="bottom"
                        />
                        <FormControlLabel
                            value="4"
                            control={<Radio />}
                            label="4"
                            labelPlacement="bottom"
                        />
                        <FormControlLabel
                            value="5"
                            control={<Radio />}
                            label="5"
                            labelPlacement="bottom"
                        />
                        <FormControlLabel
                            value="6"
                            control={<Radio />}
                            label="6"
                            labelPlacement="bottom"
                        />
                    </Stack>
                </RadioGroup>
            </FormControl>
            <Stack>
                <Button
                    variant="contained"
                    color="success"
                    onClick={handleSubmit}
                    disabled={betAmount !== "" ? false : true}
                >
                    Submit
                </Button>
                <Button
                    color="secondary"
                    onClick={handleWithdraw}
                    disabled={
                        betAmount !== "" && numberOfWins >= 1 ? false : true
                    }
                >
                    Withdraw
                </Button>
            </Stack>
        </Box>
    );
};

export default ControlPanelDisplay;
