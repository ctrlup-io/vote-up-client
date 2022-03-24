import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  TextField,
  Typography,
  Stack,
} from "@mui/material";

import { SocketContext } from "./App";

function formatRelativeDate(date) {
  const relativeTimeFormat = new Intl.RelativeTimeFormat("fr", {
    localeMatcher: "best fit",
    numeric: "always",
    style: "long",
  });
  const seconds = Math.round((date - Date.now()) / 1e3);
  if (Math.abs(seconds) < 1) return "à l'instant";
  if (Math.abs(seconds) < 60)
    return relativeTimeFormat.format(seconds, "seconds");
  const minutes = Math.round((date - Date.now()) / (1e3 * 60));
  if (Math.abs(minutes) < 60)
    return relativeTimeFormat.format(minutes, "minutes");
  const hours = Math.round((date - Date.now()) / (1e3 * 60 * 60));
  if (Math.abs(hours) < 24) return relativeTimeFormat.format(hours, "hours");
  const days = Math.round((date - Date.now()) / (1e3 * 60 * 60 * 24));
  return relativeTimeFormat.format(days, "days");
}

export default function Vote({
  id,
  title,
  description,
  count: initialCount = 0,
  contact: intialContact = [],
  createdAt,
}) {
  const socket = useContext(SocketContext);
  const [voted, setVoted] = useState(false);
  const [participated, setParticipated] = useState(false);
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(initialCount);
  const [participants, setParticipants] = useState(intialContact?.length || 0);
  useEffect(() => {
    socket.on("voted", (payload) => {
      if (id === payload.id) {
        setCount(payload.count || 0);
      }
    });
    socket.on("participated", (payload) => {
      if (id === payload.id) {
        setParticipants(payload.contact?.length || 0);
      }
    });
  }, [id, socket]);
  const toggle = () => {
    setOpen(!open);
  };
  const [contact, setContact] = useState("");
  const disabled = contact.length === 0;
  const onChangeContact = (event) => {
    setContact(event.target.value);
  };
  const onParticipate = () => {
    toggle();
    setParticipated(true);
    setContact("");
    socket.emit("participate", { id, contact });
  };
  const onVote = () => {
    setVoted(true);
    socket.emit("vote", id);
  };
  if (!id || !title) return null;
  return (
    <Card sx={{ minWidth: 320 }}>
      <CardHeader
        title={title}
        titleTypographyProps={{ variant: "h4", component: "div" }}
        subheader={formatRelativeDate(createdAt)}
      />
      {description && (
        <CardContent>
          <Typography>{description}</Typography>
        </CardContent>
      )}
      <CardActions>
        <Button
          variant={voted ? "contained" : "outlined"}
          size="small"
          onClick={onVote}
          startIcon={
            <span role="img" aria-label="rainbow">
              🌈
            </span>
          }
        >
          {count}
        </Button>
        <Button
          variant={participated ? "contained" : "outlined"}
          size="small"
          onClick={toggle}
          startIcon={
            <span role="img" aria-label="hand-up">
              🖐️
            </span>
          }
        >
          {participants}
        </Button>
      </CardActions>
      {open && (
        <CardContent>
          <Stack spacing={2}>
            <TextField
              value={contact}
              name="vote-contact"
              onChange={onChangeContact}
              autoFocus
              placeholder="Téléphone ou adresse mail"
              variant="outlined"
              helperText="Laisse nous un moyen de te recontacter pour organiser ton intervention lors d'un de nos événements tech"
            />
            <Button
              variant={disabled ? "outlined" : "contained"}
              disabled={disabled}
              onClick={onParticipate}
              fullWidth
              startIcon={
                <span role="img" aria-label="hand-up">
                  🖐️
                </span>
              }
            >
              Me proposer
            </Button>
            <Button fullWidth onClick={toggle}>
              Annuler
            </Button>
          </Stack>
        </CardContent>
      )}
    </Card>
  );
}
