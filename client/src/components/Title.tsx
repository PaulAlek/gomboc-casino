import React from "react";
import { Container, Box, Typography } from "@mui/material";

interface TitleProps {
    text: string;
}

const Title: React.FC<TitleProps> = ({ text }) => {
    return (
        <Container maxWidth="lg">
            <Box>
                <Typography
                    variant="h3"
                    p="10px"
                    align="center"
                    sx={{ color: "#FFD700" }}
                >
                    {text}
                </Typography>
            </Box>
        </Container>
    );
};

export default Title;
