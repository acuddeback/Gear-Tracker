import React from 'react'
import MemberSearch from './MemberAutocomplete'
import CheckoutCart from './CheckoutCart'
import DateTimePicker from './DatePicker'
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper'
import {withStyles} from '@material-ui/core/styles';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';
import blue from '@material-ui/core/colors/blue';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import WarningIcon from '@material-ui/icons/Warning';
import IconButton from '@material-ui/core/IconButton';
import classNames from 'classnames';
import Slide from '@material-ui/core/Slide';

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

        let message = '';
        let visible = false;
        if (sessionStorage.getItem('token') == 0) {
            message = 'You are in view-only mode. This means that none of your actions will be saved to the database.';
            visible = false;
        }

        this.state = {
            member: '',
            memberEmail: '',
            memberId: '',
            list : [],
            datetime : '',
            snackbarVisible: visible,
            snackbarMessage: message,
            variant: 'info'
        };

        this.setMember = this.setMember.bind(this);
        this.removeGear = this.removeGear.bind(this);
        this.addGearToList = this.addGearToList.bind(this);
        this.checkoutGear = this.checkoutGear.bind(this);
        this.setDateTime = this.setDateTime.bind(this);
    }


    componentDidMount() {
        setTimeout(function() {if (sessionStorage.getItem('token') == 0) {this.setState({snackbarVisible: true});}}.bind(this), 2000);
    }

    removeGear(uid) {
        for (let i = 0; i < this.state.list.length; i++)
        {
            if (this.state.list[i]['uid'] == uid)
                this.setState(prevState=>{
                    prevState.list.splice(i, 1);
                    return {list: [...prevState.list]};
                });
        }
    }

    setDateTime (newDateTime) {
        this.setState({datetime: newDateTime})
    }

    addGearToList(response) {
        let count = 0;
        for (let i = 0; i < response.length; i++) {
            let gear = response[i];
            this.setState(prevState => ({
                list: [...prevState.list, {
                    number: gear['number'],
                    item: gear['item'],
                    description: gear['description'],
                    uid: gear['uid']
                }]
            }));
            count++;
        }

        return count;
    }

    handleSnackbarClose = () => {
        this.setState({snackbarVisible : false})
    };

    checkoutGear() {

        if (sessionStorage.getItem('token') == 0) {
            this.setState({snackbarMessage: 'Checkout unsuccessful - you are in view-only mode. Please log back in as an officer.', snackbarVisible: true, variant: 'error'});
            return;
        }

        if (this.state.member == '')
        {
            this.setState({snackbarMessage: 'Checkout unsuccessful - please enter a valid member name.', snackbarVisible: true, variant: 'error'});
            return;
        }

        fetch(this.props.apiHost + '/gear/checkout', {
            method: 'POST',
            body: JSON.stringify({authorization: sessionStorage.getItem('token'), gear: this.state.list, member: this.state.member, memberEmail: this.state.memberEmail, dueDate: this.state.datetime}),
            headers:{
                'Content-Type': 'application/json'
            },
            mode: 'cors'
        }).then(response => response.json())
            .catch(error => console.error('Error with HTTP request:', error))
            .then(response => {
                console.log(response);
                if (response['status'] == 'Success!') {
                    this.setState({
                        snackbarVisible: true,
                        snackbarMessage: response['gear'].length.toString() + ' piece(s) of gear were successfully checked out to ' + response['member'],
                        variant: 'success',
                        list: [],
                    })
                }
            })
            .catch(error => console.error(error));
    }

    setMember(memberInfo) {
        this.setState({member: memberInfo.c_full_name, memberEmail: memberInfo.c_email, memberId: memberInfo.c_uid});
        console.log(memberInfo);
    }


    render() {
        return(
            <div style={{marginBottom: '12vh'}}>
                <Paper>
                    <Grid container
                          alignItems='center'
                          alignContent="stretch"
                          spacing={16}
                    >
                        <Grid sm={12} lg={3} md={5} xs={12}  item style={{margin:'3vh'}}>
                            <Typography variant="title">Member: </Typography>
                            <MemberSearch setMember={this.setMember} apiHost={this.props.apiHost}/>
                        </Grid>
                        <Grid sm={12} xs={12} md={5} lg={3} item style={{margin:'3vh'}}>
                            {/*<Slide in={true}  style={{ transitionDelay: 200}} direction="up" mountOnEnter unmountOnExit>*/}
                                <CheckoutCart addGearToList={this.addGearToList} removeGear={this.removeGear} list={this.state.list} apiHost={this.props.apiHost} data={this.props.data}/>
                            {/*</Slide>*/}
                        </Grid>
                        <Grid sm={12} xs={12} md={5} lg={3} item style={{margin:'3vh'}}>
                            {/*<Slide in={true}  style={{ transitionDelay: 300}} direction="up" mountOnEnter unmountOnExit>*/}
                                <DateTimePicker setDateTime={this.setDateTime} datetime={this.state.datetime}/>
                            {/*</Slide>*/}
                        </Grid>
                        <br/>
                    </Grid>
                </Paper>
                <Grid xs={12}
                      container
                      justify='flex-end'
                >
                    <Grid item style={{margin:'3vh'}}>
                        {/*<Slide in={true}  style={{ transitionDelay: 400}} direction="up" mountOnEnter unmountOnExit>*/}
                            <Button variant="raised" style={{backgroundColor: '#43A047'}} color="primary">
                                <Typography variant="button" onClick={this.checkoutGear} style={{color:'white'}} align="left">Checkout Gear</Typography>
                            </Button>
                        {/*</Slide>*/}
                    </Grid>
                </Grid>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    style={{margin: '2vh'}}
                    open={this.state.snackbarVisible}
                    autoHideDuration={7000}
                    onClose={this.handleSnackbarClose}
                >
                    <MySnackbarContentWrapper
                        onClose={this.handleSnackbarClose}
                        variant={this.state.variant}
                        message={this.state.snackbarMessage}
                    />
                </Snackbar>
            </div>
        );
    }
}



const variantIcon = {
    success: CheckCircleIcon,
    warning: WarningIcon,
    error: ErrorIcon,
    info: InfoIcon,
};


const styles1 = theme => ({
    success: {
        backgroundColor: green[600],
    },
    error: {
        backgroundColor: '#B71C1C',
    },
    info: {
        backgroundColor: blue[900],
    },
    warning: {
        backgroundColor: amber[700],
    },
    icon: {
        fontSize: 20,
    },
    close:{marginTop: -20},
    iconVariant: {
        opacity: 0.9,
        marginRight: theme.spacing.unit,
    },
    message: {
        display: 'flex',
        alignItems: 'center',
    },
});

function MySnackbarContent(props) {
    const { classes, className, message, onClose, variant, ...other } = props;
    const Icon = variantIcon[variant];

    return (
        <SnackbarContent
            className={classNames(classes[variant], className)}
            aria-describedby="client-snackbar"
            message={
                <span id="client-snackbar" className={classes.message}>
          <Icon className={classNames(classes.icon, classes.iconVariant)} />
                    {message}
        </span>
            }
            action={
                <IconButton
                    key="close"
                    aria-label="Close"
                    color="inherit"
                    className={classes.close}
                    onClick={onClose}
                >
                    <CloseIcon className={classes.icon} />
                </IconButton>
            }
            {...other}
        />
    );
}

const MySnackbarContentWrapper = withStyles(styles1)(MySnackbarContent);

export default withStyles(styles)(Checkout);