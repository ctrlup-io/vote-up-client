import React, { useContext, useEffect } from "react";
import { Typography } from "@mui/material";
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
  if (query.isLoading) return <Typography>Chargement...</Typography>;
  if (query.data.length === 0)
    return <Typography>Aucune proposition pour le moment.</Typography>;
  return (
    <>
      {query.data.map((vote) => (
        <Vote key={vote.id} {...vote} />
      ))}
    </>
  );
}
