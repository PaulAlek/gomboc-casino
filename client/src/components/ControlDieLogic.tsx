import * as React from "react";
import Grid from "@mui/material/Grid2";
import ControlPanelDisplay from "./ControlPanelDisplay";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Dice from "react-dice-roll";

const containerStyle = {
    width: "100%",
    height: "60%",
    backgroundColor: "#8B4513",
};

const gridItemControlPanel = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    backgroundColor: "#f5f5f5",
    padding: "10px",
};

const gridItemDie = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    backgroundColor: "#f5f5f5",
};

const ControlDieLogic: React.FC = () => {
    const [betAmount, setBetAmount] = useState<string>("");
    const [amountError, setAmountError] = useState<boolean>(false);
    const [balance, setBalance] = useState<number>(0);
    const [guessSelection, setGuessSelection] = useState("1");
    const [numberOfWins, setNumberOfWins] = useState(0);
    const [gameId, setGameId] = useState(-1);
    const [betResult, setBetResult] = useState("");
    const [lastRollValue, setLastRollValue] = useState(1);
    const hasMounted = useRef(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:5050/games/setup"
                );
                setGameId(response.data.game_id);
                setBalance(response.data.balance);
            } catch (err) {
                console.log("An error occurred while fetching data.");
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (hasMounted.current) {
            const diceButton = document.querySelector(
                "#dice-wrapper button"
            ) as HTMLButtonElement;
            if (diceButton) {
                diceButton.click();
            } else {
                console.error("Dice button not found!");
            }
        } else {
            hasMounted.current = true;
        }
    }, [lastRollValue]);

    const handleSubmit = async () => {
        console.log("Submit");

        try {
            const response = await axios.post(
                "http://localhost:5050/bets/place",
                {
                    bet_amount: betAmount,
                    guess: Number(guessSelection),
                }
            );

            setLastRollValue(response.data.dice_roll);

            setTimeout(() => {
                if (response.data.game_end === true) {
                    setGameId(response.data.game_id);
                    setBalance(response.data.new_balance);
                    setNumberOfWins(0);
                    setBetResult("");
                }
                if (response.data.win) {
                    setNumberOfWins(numberOfWins + 1);
                    setBetResult("win");
                } else {
                    setBetResult("lose");
                }

                setBalance(response.data.new_balance);
            }, 1050);
        } catch (err) {
            console.log("An error occurred while submitting the data.");
        } finally {
        }
    };
    const handleWithdraw = async () => {
        if (numberOfWins < 1) {
        } else {
            console.log("Withdraw");
            try {
                const response = await axios.patch(
                    "http://localhost:5050/games/reset",
                    {}
                );

                setGameId(response.data.new_game_id);
                setBalance(response.data.balance);
                setNumberOfWins(0);
                setBetResult("");
            } catch (err) {
                console.log("An error occurred while submitting the data.");
            } finally {
            }
        }
    };
    const handleGuessChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setGuessSelection((event.target as HTMLInputElement).value);
    };

    const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        const isValid = /^[0-9]*\.?[0-9]*$/.test(newValue);

        if ((isValid || newValue === "") && Number(newValue) <= balance) {
            setBetAmount(newValue);
            setAmountError(false);
        } else {
            setAmountError(true);
        }
    };

    const cheatValue =
        lastRollValue >= 1 && lastRollValue <= 6
            ? (lastRollValue as 1 | 2 | 3 | 4 | 5 | 6)
            : 1;

    return (
        <Grid
            container
            style={containerStyle}
            justifyContent="center"
            alignItems="center"
        >
            <Grid style={gridItemControlPanel} size={4}>
                <ControlPanelDisplay
                    balance={balance}
                    setBetAmount={setBetAmount}
                    betAmount={betAmount}
                    amountError={amountError}
                    handleAmountChange={handleAmountChange}
                    guessSelection={guessSelection}
                    handleGuessChange={handleGuessChange}
                    handleSubmit={handleSubmit}
                    handleWithdraw={handleWithdraw}
                    numberOfWins={numberOfWins}
                    betResult={betResult}
                />
            </Grid>
            <Grid style={gridItemDie} size={8}>
                <div id="dice-wrapper">
                    <Dice cheatValue={cheatValue} defaultValue={1} />
                </div>
            </Grid>
        </Grid>
    );
};

export default ControlDieLogic;
