import React, { createContext } from "react";
import { Grid, CssBaseline, Stack, Typography } from "@mui/material";
import { theme } from "@ctrlup/rainbow-react";
import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
} from "@mui/material/styles";
import { ThemeProvider as EmotionThemeProvider } from "@emotion/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { io } from "socket.io-client";
import QRCode from "qrcode.react";

import Votes from "./Votes";
import Rainbow from "./Rainbow";
import VoteForm from "./VoteForm";

const queryClient = new QueryClient();
const muiTheme = createTheme(theme, {
  components: {
    MuiCardContent: {
      styleOverrides: {
        root: {
          paddingTop: 16,
          paddingBottom: 16,
          paddingLeft: 16,
          paddingRight: 16,
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          paddingTop: 16,
          paddingBottom: 16,
          paddingLeft: 16,
          paddingRight: 16,
        },
      },
    },
    MuiCardActions: {
      styleOverrides: {
        root: {
          paddingTop: 16,
          paddingBottom: 16,
          paddingLeft: 16,
          paddingRight: 16,
        },
      },
    },
  },
});

export const SocketContext = createContext();
const socket = io(process.env.API_URI);

export default function App() {
  return (
    <SocketContext.Provider value={socket}>
      <QueryClientProvider client={queryClient}>
        <EmotionThemeProvider theme={muiTheme}>
          <MuiThemeProvider theme={muiTheme}>
            <CssBaseline />
            <Grid
              container
              justifyContent="center"
              bgcolor="background.default"
            >
              <Grid item alignContent="center">
                <Stack spacing={2} maxWidth="sm" p={8}>
                  <QRCode
                    value={window.location.href}
                    renderAs="svg"
                    size={null}
                    bgColor="transparent"
                    fgColor="url(#rainbow)"
                  />
                  <Rainbow />
                  <Typography textAlign="center">
                    Scanne le QRCode pour participer au vote !{" "}
                    <span role="img" aria-label="photo">
                      📸
                    </span>
                  </Typography>
                </Stack>
              </Grid>
              <Grid item>
                <Stack spacing={2} maxWidth="sm" p={8}>
                  <Typography variant="h2" mb={1} width="100%">
                    Propositions
                  </Typography>
                  <Typography variant="body1" mb={4} width="100%">
                    Tu as un sujet ou une question que tu aimerais voir lors d'un
                    de nos événements tech ?<br />
                    Propose (
                    <span role="img" aria-label="bulb">
                      💡
                    </span>
                    ) et/ou vote (
                    <span role="img" aria-label="rainbow">
                      🌈
                    </span>
                    ) pour tes sujets préférés, propose-toi (
                    <span role="img" aria-label="hand-up">
                      🖐️
                    </span>
                    ) en tant que présentateur.
                  </Typography>
                  <VoteForm />
                </Stack>
                <Votes />
              </Grid>
            </Grid>
          </MuiThemeProvider>
        </EmotionThemeProvider>
      </QueryClientProvider>
    </SocketContext.Provider>
  );
}
