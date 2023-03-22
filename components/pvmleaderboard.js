const { Card, CardContent, Typography, Grid, Paper, Box, Stack } = require('@mui/material');
const { makeStyles, ThemeProvider } = require('@material-ui/styles');
const { purple } = require('@material-ui/core/colors');
const React = require('react');

require("@babel/register")({
  presets: ["@babel/preset-react"]
});


function Pvmleaderboard  ( data )  {
    const {players} = data;
    const topThree = players.slice(0, 3);
    let sum = 0;
    players.forEach((v) => {
      sum += v.gp;
    });
  
    return (
      <div>
        <style>
          {`
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
          `}
        </style>
        <Box sx={{ backgroundColor: 'white' }}>
        <div className="container">
        <div style={{ textAlign: 'center', backgroundColor: '#313338', padding: 0 }}>
        <Typography variant="h6" align="center" fontSize={128} fontWeight="bold" color="white">
                PVM LEADERBOARD
        </Typography>
         </div>
            <Grid container justifyContent="center">
              {topThree.map((player, index) => (
                <Grid item key={player.name} xs={12} lg={4}>
                  <Paper elevation={24} sx={{ margin:3, minHeight: 175, backgroundColor:
          index === 0 ? '#fdd800' : index === 1 ? '#dfdfdf' : index === 2 ? '#fd6400' : 'white', padding: 5 }} className="player">
                    <Grid container direction="column" spacing={5}>
                      <Grid item>
                        <Typography variant="h6" align="left" fontSize={74} fontWeight="bold">
                          #{index + 1}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="h5" align="center" fontSize={89} fontWeight="bold">
                          {player.name}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="body1" align="center" fontSize={74} fontWeight="bold">
                          {player.gp.toLocaleString('en-US')} GP
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              ))}
    
              {players.slice(3).map((player, index) => (
                <Grid item key={player.name} xs={3} lg={3}>
                  <Paper elevation={2} sx={{ margin:3, minHeight: 175, backgroundColor: '#97f4fe', padding: 5 }} className="player player-blue">
                    <Grid container direction="column"  spacing={1}>
                      <Grid item>
                        <Typography variant="h6" align="left" fontSize={62} fontWeight="bold">
                          #{index + 4}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="h5" align="center" fontSize={74} fontWeight="bold">
                          {player.name}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="body1" align="center" fontSize={62} fontWeight="bold">
                          {player.gp.toLocaleString('en-US')} GP
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          
          <div style={{ textAlign: 'center', backgroundColor: '#313338', padding: 10 }}>
          <Typography variant="h6" align="center" fontSize={92} fontWeight="bold" color="white">
              Total Gold Earned: {sum.toLocaleString('en-US')} GP
            </Typography>
    </div>
        </div>
        </Box>
      </div>
      
    );
  }
    

module.exports = Pvmleaderboard;