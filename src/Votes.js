import React from "react";
import { Stack, Typography } from "@mui/material";
import { useQuery } from "react-query";

import Vote from "./Vote";

export default function Votes() {
  const query = useQuery("votes", async () => {
    const response = await fetch(new URL("/votes", process.env.API_URI));
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  });
  if (query.error) return null;
  if (query.isLoading) return <Typography>Chargement...</Typography>;
  if (query.data.length === 0) return <Typography>Aucun votes.</Typography>;
  return (
    <Stack spacing={2}>
      {query.data.map((vote) => (
        <Vote key={vote.id} {...vote} />
      ))}
    </Stack>
  );
}
