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

export default function Vote({
  id,
  title,
  description,
  count: initialCount = 0,
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
    return socket.off("voted")
  }, [id, socket]);
  const onVote = () => {
    setVoted(true);
    socket.emit("vote", id);
  };
  if (!id || !title) return null;
  return (
    <Card sx={{ minWidth: 320 }}>
      <CardHeader title={title} />
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
