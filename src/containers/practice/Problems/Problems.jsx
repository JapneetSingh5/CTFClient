import React, { Component } from 'react';
import {
  Typography, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Grid, Container, Box,
  Button, TextField,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import Axios from 'axios';
import Spinner from '../../../components/UI/Spinner/Spinner';
import * as probelmActions from '../../../store/actions/index';


class problems extends Component {
  componentDidMount() {
    const { onInitProblems } = this.props;
    onInitProblems('1');
  }

  constructor(props){
    super(props);
    this.state = {
      answer: '',
      id: ''
    }
  }

  status = (_id) => {
    const { profile } = this.props
    if(profile){
      if(profile.problems.includes(_id)){
        return true
      }
    }
    return false
  }

  answerInput = (event) => {
    event.preventDefault();
    const answer = event.target.value;
    this.setState({ answer });
  }

  submitAnswerHandler = async (prb) => {
    const { profile, token } = this.props
    const { answer } = this.state;console.log(prb,answer)
    if(token && prb.answer === answer){
          console.log('Sedning req')
         profile.problems.push(prb._id)
         prb.userSolved = prb.userSolved + 1
         const url = 'http://localhost:3000/api/problem/'+prb._id
         const response = await Axios({
            method: 'PUT',
            url: url,
            data: {
              problems: profile.problems,
              userSolved: prb.userSolved
            },
            headers: { 'Authorization': 'Bearer ' + token }
         });
         console.log(response) 
    }
  }

  render() {
    const { problemsList } = this.props;
    let prob = null;
    if (problemsList) {
      prob = (problemsList).map(el => (
        <div style={{ width: '100%' }} key={el.id}>
          <ExpansionPanel>
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Grid container spacing={3}>
                <Grid item xs={3}>
                  <Typography>
                    {el.name}
                    {' '}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography>
                    {el.userSolved}
                    {' '}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography>
                    {el.score}
                    {' '}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography>
                    {this.status(el._id) ? 'Solved' : 'Unsolved'}
                    {' '}
                  </Typography>
                </Grid>


              </Grid>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Typography>
                {el.details}
                <div>
                  <TextField
                    id="standard-full-width"
                    label="Answer"
                    style={{ margin: 8 }}
                    fullWidth
                    margin="large"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={this.answerInput}
                  />
                  <Button variant="outlined" color="primary" onClick={() => this.submitAnswerHandler(el)}>
        Submit
                  </Button>

                </div>
              </Typography>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </div>
      ));
    }

    let display = <Spinner />;
    if (problemsList) {
      display = (
        <div>
          <br />
          <Grid container spacing={3}>
            <Grid item xs={3}>
              <Typography variant="h4">Problems  </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="h4">Users Solved </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="h4">Score  </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="h4">Status  </Typography>
            </Grid>


          </Grid>

        </div>
      );
    }


    return (
      <div>
        <Container maxWidth="md">
          <Typography variant="h1" align="center">
                    Problems
          </Typography>
          <Box p={2}>
            {display}
          </Box>
          <Box p={2}>
            {prob}
          </Box>
          <Box p={3}>
            <NavLink to="/add/problem"><Typography variant="h4" align="center">Add a new Problem</Typography></NavLink>
          </Box>
        </Container>


      </div>
    );
  }
}

problems.propTypes = {
  onInitProblems: PropTypes.node.isRequired,
  problemsList: PropTypes.node.isRequired,
};

const mapStateToProps = state => ({
  problemsList: state.problems,
  token: state.token,
  profile: state.profile
});
const mapDispatchToProps = dispatch => ({
  onInitProblems: (problemType) => dispatch(probelmActions.initProbelms(problemType)),
});


export default connect(mapStateToProps, mapDispatchToProps)(problems);
