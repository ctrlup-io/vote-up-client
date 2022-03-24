import { Button, TextField } from "@mui/material";
import React, { useContext, useState } from "react";

import { SocketContext } from "./App";

export default function VoteForm() {
  const socket = useContext(SocketContext);
  const [open, setOpen] = useState(false);
  const toggle = () => {
    setOpen(!open);
  };
  const [title, setName] = useState("");
  const onChange = (event) => {
    setName(event.target.value);
  };
  const onAdd = () => {
    if (title.length > 0) {
      setName("");
      toggle();
      socket.emit("add", { title });
    }
  };
  const disabled = title.length === 0;
  return open ? (
    <>
      <TextField
        value={title}
        name="vote-name"
        onChange={onChange}
        onSubmit={onAdd}
        autoFocus
        placeholder="Titre du sujet"
        variant="outlined"
      />
      <Button
        variant={disabled ? "outlined" : "contained"}
        disabled={disabled}
        onClick={onAdd}
        startIcon={
          <span role="img" aria-label="bulb">
            💡
          </span>
        }
      >
        Proposer
      </Button>
      <Button onClick={toggle}>Annuler</Button>
    </>
  ) : (
    <Button
      onClick={toggle}
      variant="contained"
      startIcon={
        <span role="img" aria-label="bulb">
          💡
        </span>
      }
    >
      Proposer un sujet
    </Button>
  );
}
