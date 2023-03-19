const { Card, CardContent, Typography, Grid, Paper } = require('@material-ui/core');
const { makeStyles, ThemeProvider } = require('@material-ui/styles');
const { purple } = require('@material-ui/core/colors');
const React = require('react');


const useStyles = makeStyles({
    paper: {
      margin: '1rem',
      padding: '1rem',
      border: '1px solid black',
      maxWidth: '25%',
      '&:hover': {
        boxShadow: '0 0 11px rgba(33,33,33,.2)'
      }
    },
    topThree: {
      maxWidth: '33.33%',
    },
    playerInfo: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    playerAvatar: {
      marginRight: '1rem'
    },
    playerName: {
      fontWeight: 'bold',
      fontSize: '1.1rem'
    },
    playerScore: {
      fontWeight: 'bold',
      fontSize: '1.1rem',
      color: '#f50057'
    },
    playerRank: {
      fontSize: '2rem',
      color: '#f50057'
    }
  });


function Pkleaderboard  ( data )  {
    const classes = useStyles();
    const {players} = data;
    const topThree = players.slice(0, 3);
  
    return (
        <div>
          <div>
            <h2>Leaderboard</h2>
            {topThree.map((player, index) => (
              <Paper key={player.name} className={`${classes.paper} ${classes.topThree}`}>
                <div className={classes.playerInfo}>
                  <div className={classes.playerAvatar}>
                    <img src={player.avatarUrl} alt={player.name} width={50} height={50} />
                  </div>
                  <div>
                    <div className={classes.playerName}>{player.name}</div>
                    <div className={classes.playerScore}>{player.gp} GP</div>
                  </div>
                  <div className={classes.playerRank}>#{index + 1}</div>
                </div>
              </Paper>
            ))}
          </div>
          <div>
            {players.slice(3).map((player, index) => (
              <Paper key={player.name} className={classes.paper}>
                <div className={classes.playerInfo}>
                  <div className={classes.playerAvatar}>
                    <img src={player.avatarUrl} alt={player.name} width={50} height={50} />
                  </div>
                  <div>
                    <div className={classes.playerName}>{player.name}</div>
                    <div className={classes.playerScore}>{player.gp} GP</div>
                  </div>
                  <div className={classes.playerRank}>#{index + 4}</div>
                </div>
              </Paper>
            ))}
          </div>
        </div>
      );
    }
    

module.exports = Pkleaderboard;