import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Title from "./Title";
import ControlDieLogic from "./ControlDieLogic";

export default function MainContainer() {
    return (
        <React.Fragment>
            <CssBaseline />
            <Box
                sx={{
                    bgcolor: "#006400",
                    paddingTop: "100px",

                    height: "100vh",
                }}
                alignItems="center"
            >
                <Container maxWidth="lg" sx={{ paddingTop: "10px" }}>
                    <Box
                        sx={{
                            bgcolor: "#006400",
                            height: "60vh",
                            paddingLeft: "35px",
                            paddingRight: "35px",
                        }}
                    >
                        <Title text="Gomboc Gambling Casino" />
                        <ControlDieLogic />
                    </Box>
                </Container>
            </Box>
        </React.Fragment>
    );
}
