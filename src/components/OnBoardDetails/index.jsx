import React, { useState,useEffect } from "react";
import { styled } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { Typography } from "@mui/material";
import { calculteResult } from '../../utils'

const useStyles = makeStyles(() => ({
  container: {
    height: "100%",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
}));

export default function BasicGrid() {
  const classes = useStyles();
  const [userName, setUserName]                       = useState("")
  const [cityName, setCityName]                       = useState("")
  const [latitide, setLatitude]                       = useState("")
  const [latitudeHemisphere, setLatitudeHemisphere]   = useState("")
  const [longitude, setLongitude]                     = useState("")
  const [longitudeHemisphere, setLongitudeHemisphere] = useState("")

  const clearForm = () => {
    setUserName("")
    setCityName("")
    setLatitude("")
    setLatitudeHemisphere("")
    setLongitude("")
    setLongitudeHemisphere("")
  }

  const calculateData = () => {
    console.log("clicked on calculate data")
    //Validation layer if all the required fields are entered
    const fields = [latitide, latitudeHemisphere, longitude, longitudeHemisphere];
    const hasEmptyField = fields.some(field => field.trim() === "")
    if(hasEmptyField) {
      alert("Enter all the required fields")
      return ;
    }
    //Calculate data
    const result = calculteResult(latitide,latitudeHemisphere, longitude, longitudeHemisphere)
    //Display the result in a pop up
  }

  return (
    <Box sx={{ flexGrow: 1 }} className={classes.container}>
      <Box
        component="form"
        sx={{
          "& .MuiTextField-root": { m: 1, width: "25ch" },
          padding: "20px",
          boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
        }}
        noValidate
        autoComplete="off"
      >
        <div>
          <TextField
            id="outlined-multiline-flexible"
            label="Your Name"
            multiline
            maxRows={1}
            value={userName}
            onChange = {(e)=> setUserName(e.target.value)}
          />
          <TextField
            id="outlined-textarea"
            label="City Name"
            placeholder="Placeholder"
            multiline
            value={cityName}
            onChange = {(e)=> setCityName(e.target.value)}
          />
        </div>
        <div>
          <TextField
            id="filled-multiline-flexible"
            label="Latitude *"
            variant="filled"
            value={latitide}
            onChange = {(e)=> setLatitude(e.target.value)}
          />
          <TextField
            id="filled-textarea"
            label="Hemisphere N/S *"
            placeholder="Placeholder"
            variant="filled"
            value={latitudeHemisphere}
            onChange = {(e)=> setLatitudeHemisphere(e.target.value)}
          />
        </div>
        <div>
          <TextField
            id="standard-multiline-flexible"
            label="Longitude *"
            variant="filled"
            value={longitude}
            onChange = {(e)=> setLongitude(e.target.value)}
          />
          <TextField
            id="standard-textarea"
            label="Hemisphere E/W *"
            placeholder="Placeholder"
            variant="filled"
            value={longitudeHemisphere}
            onChange = {(e)=> setLongitudeHemisphere(e.target.value)}
          />
        </div>
        <Typography sx={{color:'blue', mt:'1em'}} fontSize={"0.75em"}>
          * Calculates the solar geometry data for entered location
        </Typography>
        <Stack spacing={2} direction="row" sx={{mt:'2em', display:'flex', justifyContent:'flex-end'}}>
          <Button variant="text" sx={{textTransform:'none'}} onClick={clearForm}>Clear</Button>
          <Button variant="outlined" sx={{textTransform:'none'}} onClick={calculateData}>Calculate</Button>
        </Stack>
      </Box>
    </Box>
  );
}
