import React, { useContext, useEffect } from "react";
import { Stack, Typography } from "@mui/material";
import { useQuery } from "react-query";

import Vote from "./Vote";
import { SocketContext } from "./App";

export default function Votes() {
  const socket = useContext(SocketContext);
  const query = useQuery("votes", async () => {
    const response = await fetch(new URL("/votes", process.env.API_URI));
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  });
  useEffect(() => {
    socket.on("added", () => {
      query.refetch();
    });
  }, [query, socket]);
  if (query.error) return null;
  if (query.isLoading)
    return (
      <Stack spacing={2} maxWidth="sm" p={8}>
        <Typography>Chargement...</Typography>
      </Stack>
    );
  if (query.data.length === 0)
    return (
      <Stack spacing={2} maxWidth="sm" p={8}>
        <Typography>Aucune proposition pour le moment.</Typography>
      </Stack>
    );
  return (
    <Stack spacing={2} maxWidth="sm" p={8}>
      {query.data.map((vote) => (
        <Vote key={vote.id} {...vote} />
      ))}
    </Stack>
  );
}
