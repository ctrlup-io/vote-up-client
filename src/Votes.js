import React, { useContext, useEffect, useState } from "react";
import { Box, Stack, Tab, Tabs, Typography } from "@mui/material";
import { useQuery } from "react-query";

import Vote from "./Vote";
import { SocketContext } from "./App";

const tabs = {
  0: { limit: 5, sort: "count" },
  1: { limit: 50, sort: "createdAt" },
};

export default function Votes() {
  const [tab, setTab] = useState(0);
  const handleChange = (event, value) => {
    setTab(value);
  };
  const socket = useContext(SocketContext);
  const query = useQuery(["votes", tab], async () => {
    const response = await fetch(
      new URL(
        `/votes?limit=${tabs[tab].limit}&sort=${tabs[tab].sort}`,
        process.env.API_URI
      )
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  });
  useEffect(() => {
    socket.on("added", () => {
      query.refetch();
      setTab(1);
    });
  }, [query, socket]);
  if (query.error) return null;
  if (query.isLoading) return <Typography>Chargement...</Typography>;
  if (query.data.length === 0)
    return <Typography>Aucune proposition pour le moment.</Typography>;
  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tab}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab
            label="Top 5"
            icon={
              <span role="img" aria-label="trophey">
                🏆️
              </span>
            }
            iconPosition="start"
            {...a11yProps(0)}
          />
          <Tab
            label="Derniers ajouts"
            icon={
              <span role="img" aria-label="new">
                🆕
              </span>
            }
            iconPosition="start"
            {...a11yProps(1)}
          />
        </Tabs>
      </Box>
      <TabPanel value={tab} index={0}>
        <Stack spacing={2}>
          {query.data.map((vote) => (
            <Vote key={vote.id} {...vote} />
          ))}
        </Stack>
      </TabPanel>
      <TabPanel value={tab} index={1}>
        <Stack spacing={2}>
          {query.data.map((vote) => (
            <Vote key={vote.id} {...vote} />
          ))}
        </Stack>
      </TabPanel>
    </Box>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tab-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}
