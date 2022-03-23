import React, { createContext } from "react";
import { Container, CssBaseline } from "@mui/material";
import { theme } from "@ctrlup/rainbow-react";
import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
} from "@mui/material/styles";
import { ThemeProvider as EmotionThemeProvider } from "@emotion/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { io } from "socket.io-client";

import Votes from "./Votes";

const queryClient = new QueryClient();
const muiTheme = createTheme(theme);

export const SocketContext = createContext();
const socket = io(process.env.API_URI);

export default function App() {
  return (
    <SocketContext.Provider value={socket}>
      <QueryClientProvider client={queryClient}>
        <EmotionThemeProvider theme={muiTheme}>
          <MuiThemeProvider theme={muiTheme}>
            <CssBaseline />
            <Container
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexWrap: "wrap",
                minHeight: "100vh",
                background: "background.default",
              }}
            >
              <Votes />
            </Container>
          </MuiThemeProvider>
        </EmotionThemeProvider>
      </QueryClientProvider>
    </SocketContext.Provider>
  );
}
