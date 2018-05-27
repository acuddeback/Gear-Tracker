import React from 'react'
import MemberSearch from './MemberAutocomplete'
import CheckoutCart from './CheckoutCart'
import DateTimePicker from './DatePicker'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper'
import { withStyles } from '@material-ui/core/styles';



const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    demo: {
        height: '100%',
    },
    paper: {
        padding: theme.spacing.unit * 2,
        margin: theme.spacing.unit,
        height: '100%',
        color: theme.palette.text.secondary,
    },
    control: {
        padding: theme.spacing.unit * 2,
    },
});

class Checkout extends React.Component{

    constructor(props){
        super(props);
        this.state = {}
    }

    render() {
        const { classes } = this.props;

        return(
            <Grid container
                  style={{marginBottom: '12vh'}}
                  direction="column"
                  alignItems='center'
                  className={classes.root}
                  spacing={8}>
                <Grid item>
                    <Grid container
                          alignItems='stretch'
                          direction="column"
                    >
                        <Grid item>
                            <Paper className={classes.paper}>
                                <Typography variant="title">Member: </Typography>
                                <MemberSearch />
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item>
                    <Grid container
                          alignItems='center'
                          direction="row"
                          justify='center'
                          spacing={8}>

                        <Grid item>
                            <Paper className={classes.paper}>
                                <CheckoutCart/>
                            </Paper>
                        </Grid>

                        <Grid item>
                            <Grid container
                            direction="column"
                            alignItems="stretch">
                                <Grid item>
                                    <Paper className={classes.paper}>
                                        <Typography variant="title">Checkout Notes: </Typography>
                                        <TextField
                                            multiline
                                            label="(Optional)"/>
                                    </Paper>
                                </Grid>
                                <Grid item>
                                    <Paper className={classes.paper}>
                                        <DateTimePicker/>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Grid>

                    </Grid>
                </Grid >
                <Grid item>
                    <Button style={{backgroundColor: '#43A047'}} color="primary">
                        <Typography variant="button" style={{color:'white'}} align="left">Checkout Gear</Typography>
                    </Button>
                </Grid>
            </Grid>
        );
    }
}

export default withStyles(styles)(Checkout);