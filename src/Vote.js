import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Typography,
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
  createdAt,
}) {
  const socket = useContext(SocketContext);
  const [voted, setVoted] = useState(false);
  const [count, setCount] = useState(initialCount);
  useEffect(() => {
    socket.on("voted", (payload) => {
      if (id === payload.id) {
        setCount(payload.count || 0);
      }
    });
  }, [id, socket]);
  const onVote = () => {
    setVoted(true);
    socket.emit("vote", id);
  };
  if (!id || !title) return null;

  return (
    <Card sx={{ minWidth: 320 }}>
      <CardHeader
        title={title}
        titleTypographyProps={{ variant: "h4" }}
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
      </CardActions>
    </Card>
  );
}
