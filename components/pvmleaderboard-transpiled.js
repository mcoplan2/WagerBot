const {
  Card,
  CardContent,
  Typography,
  Grid,
  Paper,
  Box,
  Stack
} = require('@mui/material');
const {
  makeStyles,
  ThemeProvider
} = require('@material-ui/styles');
const {
  purple
} = require('@material-ui/core/colors');
const React = require('react');
require("@babel/register")({
  presets: ["@babel/preset-react"]
});
function Pvmleaderboard(data) {
  const {
    players
  } = data;
  const topThree = players.slice(0, 3);
  let sum = 0;
  players.forEach(v => {
    sum += v.gp;
  });
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("style", null, `
            body {
              width: 2600px;
              height: 2600px;
            }
    
            .container {
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              width: 100%;
              height: 100%;
              background-color: #313338;
            }
    
            .header {
              width: 100%;
              height: 100px;
              background-color: lightgray;
              border: 5px cyan;
              padding: 3px;
              margin: 3px;
            }
    
            .footer {
              width: 100%;
              height: 100px;
              background-color: lightgray;
              border: 5px cyan;
              padding: 3px;
              margin: 3px;
            }
            
            .player {
              border: 1px solid white;
              margin: 3px;
              padding: 3px;
              min-height: 175px;
              background-color: white;
            }
    
            .player-blue {
              background-color: lightblue;
            }
          `), /*#__PURE__*/React.createElement(Box, {
    sx: {
      backgroundColor: 'white'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      backgroundColor: '#313338',
      padding: 0
    }
  }, /*#__PURE__*/React.createElement(Typography, {
    variant: "h6",
    align: "center",
    fontSize: 128,
    fontWeight: "bold",
    color: "white"
  }, "PVM LEADERBOARD")), /*#__PURE__*/React.createElement(Grid, {
    container: true,
    justifyContent: "center"
  }, topThree.map((player, index) => /*#__PURE__*/React.createElement(Grid, {
    item: true,
    key: player.name,
    xs: 12,
    lg: 4
  }, /*#__PURE__*/React.createElement(Paper, {
    elevation: 24,
    sx: {
      margin: 3,
      minHeight: 175,
      backgroundColor: index === 0 ? '#fdd800' : index === 1 ? '#dfdfdf' : index === 2 ? '#fd6400' : 'white',
      padding: 5
    },
    className: "player"
  }, /*#__PURE__*/React.createElement(Grid, {
    container: true,
    direction: "column",
    spacing: 5
  }, /*#__PURE__*/React.createElement(Grid, {
    item: true
  }, /*#__PURE__*/React.createElement(Typography, {
    variant: "h6",
    align: "left",
    fontSize: 74,
    fontWeight: "bold"
  }, "#", index + 1)), /*#__PURE__*/React.createElement(Grid, {
    item: true
  }, /*#__PURE__*/React.createElement(Typography, {
    variant: "h5",
    align: "center",
    fontSize: 89,
    fontWeight: "bold"
  }, player.name)), /*#__PURE__*/React.createElement(Grid, {
    item: true
  }, /*#__PURE__*/React.createElement(Typography, {
    variant: "body1",
    align: "center",
    fontSize: 74,
    fontWeight: "bold"
  }, player.gp.toLocaleString('en-US'), " GP")))))), players.slice(3).map((player, index) => /*#__PURE__*/React.createElement(Grid, {
    item: true,
    key: player.name,
    xs: 3,
    lg: 3
  }, /*#__PURE__*/React.createElement(Paper, {
    elevation: 2,
    sx: {
      margin: 3,
      minHeight: 175,
      backgroundColor: '#97f4fe',
      padding: 5
    },
    className: "player player-blue"
  }, /*#__PURE__*/React.createElement(Grid, {
    container: true,
    direction: "column",
    spacing: 1
  }, /*#__PURE__*/React.createElement(Grid, {
    item: true
  }, /*#__PURE__*/React.createElement(Typography, {
    variant: "h6",
    align: "left",
    fontSize: 62,
    fontWeight: "bold"
  }, "#", index + 4)), /*#__PURE__*/React.createElement(Grid, {
    item: true
  }, /*#__PURE__*/React.createElement(Typography, {
    variant: "h5",
    align: "center",
    fontSize: 74,
    fontWeight: "bold"
  }, player.name)), /*#__PURE__*/React.createElement(Grid, {
    item: true
  }, /*#__PURE__*/React.createElement(Typography, {
    variant: "body1",
    align: "center",
    fontSize: 62,
    fontWeight: "bold"
  }, player.gp.toLocaleString('en-US'), " GP"))))))), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      backgroundColor: '#313338',
      padding: 10
    }
  }, /*#__PURE__*/React.createElement(Typography, {
    variant: "h6",
    align: "center",
    fontSize: 92,
    fontWeight: "bold",
    color: "white"
  }, "Total Gold Earned: ", sum.toLocaleString('en-US'), " GP")))));
}
module.exports = Pvmleaderboard;
