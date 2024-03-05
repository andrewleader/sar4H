import * as React from 'react';
import Api from '../api';
import * as Responses from '../api/responses';
import { Button, TextField, Typography, styled } from '@mui/material';

const StyledRoot = styled('div')({
  padding: "24px",
  maxWidth: "500px",
  marginLeft: "auto",
  marginRight: "auto"
});

const StyledTitle = styled(Typography)({
  textAlign: "center"
});

const StyledError = styled('p')({
  color: "red"
});

const StyledLogInButton = styled(Button)({
  width: "100%"
});

export interface LogInProps {
  onSuccess: (response: Responses.IAuthenticateResponse) => void;
}

interface LogInState {
  username: string,
  password: string,
  signingIn: boolean,
  error: string | null
}

class LogIn extends React.Component<LogInProps, LogInState> {
  
  state: LogInState = {
    username: "",
    password: "",
    signingIn: false,
    error: null
  };

  render() {
    return (
      <StyledRoot>
        <StyledTitle variant="h2">
          SAR4H
        </StyledTitle>
        <TextField
          id="username"
          label="Username"
          margin="normal"
          fullWidth={true}
          disabled={this.state.signingIn}
          onChange={(e) => this.setState({ username: e.target.value })}
        />
        <TextField
          id="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          margin="normal"
          fullWidth={true}
          disabled={this.state.signingIn}
          onChange={(e) => this.setState({ password: e.target.value })}
        />

        <StyledError>{this.state.error}</StyledError>
        <StyledLogInButton
          variant="contained"
          color="primary"
          disabled={this.state.signingIn}
          onClick={this.logIn}>
            Log In
        </StyledLogInButton>
      </StyledRoot>
    );
  }

  logIn = async () => {

    if (this.state.username.length === 0) {
      this.goToErrorState("You must enter a username!");
      return;
    }
    
    if (this.state.password.length === 0) {
      this.goToErrorState("You must enter a password!");
      return;
    }

    this.goToSigningInState();

    try {
      var response = await Api.authenticateAsync(this.state.username, this.state.password);

      if (response.data.token) {
        this.props.onSuccess(response);
      } else {
        this.goToErrorState("Unknown error. Token not present.");
      }
    } catch (err) {
      this.goToErrorState(err.toString());
    }
  }

  goToSigningInState() {
    this.setState({
      signingIn: true,
      error: null
    });
  }

  goToErrorState(error: string) {
    this.setState({
      signingIn: false,
      error: error
    });
  }
}

export default LogIn;