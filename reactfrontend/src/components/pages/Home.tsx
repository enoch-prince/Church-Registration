import { FC } from "react";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexWrap: "wrap",
      "& > *": {
        margin: theme.spacing(1),
        width: theme.spacing(16),
        height: theme.spacing(16)
      }
    },
    paperStyle: {
      padding: 20,
      height: "75vh",
      width: "100vh",
      margin: "30px auto"
    }
  })
);

const Home: FC = () => {
  const classes = useStyles();

  return (
    <Container maxWidth="sm" className={classes.root}>
      <Paper elevation={3} className={classes.paperStyle}>
        <Typography variant="h4" component="h4" align="center">
          Welcome to the Homepage
        </Typography>
      </Paper>
    </Container>
  );
};

export default Home;
