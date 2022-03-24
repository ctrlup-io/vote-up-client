import {
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  TextField,
} from "@mui/material";
import React, { useContext, useState } from "react";

import { SocketContext } from "./App";

export default function VoteForm() {
  const socket = useContext(SocketContext);
  const [open, setOpen] = useState(false);
  const toggle = () => {
    setOpen(!open);
  };
  const [title, setTitle] = useState("");
  const onChangeTitle = (event) => {
    setTitle(event.target.value);
  };
  const [description, setDescription] = useState("");
  const onChangeDescription = (event) => {
    setDescription(event.target.value);
  };
  const [checked, setChecked] = useState(false);
  const handleChangeCheck = (event) => {
    setChecked(event.target.checked);
  };
  const [contact, setContact] = useState("");
  const onChangeContact = (event) => {
    setContact(event.target.value);
  };
  const onAdd = () => {
    if (title.length > 0) {
      toggle();
      setTitle("");
      setDescription("");
      socket.emit("add", { title, description, contact: [contact] });
    }
  };
  const disabled = title.length === 0;
  return open ? (
    <>
      <TextField
        value={title}
        name="vote-title"
        onChange={onChangeTitle}
        autoFocus
        placeholder="Titre du sujet"
        variant="outlined"
        required
      />
      <TextField
        value={description}
        name="vote-description"
        multiline
        rows={3}
        onChange={onChangeDescription}
        autoFocus
        placeholder="Description du sujet"
        variant="outlined"
      />
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox label="" checked={checked} onChange={handleChangeCheck} />
          }
          label="Chaud pour le présenter !"
        />
      </FormGroup>
      {checked && (
        <TextField
          value={contact}
          name="vote-contact"
          onChange={onChangeContact}
          autoFocus
          placeholder="Téléphone ou adresse mail"
          variant="outlined"
          helperText="Laisse nous un moyen de te recontacter pour organiser ton intervention lors d'un de nos événements tech"
        />
      )}
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
