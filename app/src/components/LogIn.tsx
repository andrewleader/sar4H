import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Api from '../api';

export interface LogInProps {

}

interface LogInState {
  username: string,
  password: string,
  signingIn: boolean,
  signedIn: boolean,
  error: string | null
}

class LogIn extends React.Component<LogInProps, LogInState> {
  state: LogInState = {
    username: "",
    password: "",
    signingIn: false,
    signedIn: false,
    error: null
  };

  render() {
    return (
      <div>
        <p>Error: {this.state.error}</p>
        <TextField
          required
          id="username"
          label="Username"
          margin="normal"
          fullWidth={true}
          disabled={this.state.signingIn}
          onChange={(e) => this.setState({ username: e.target.value })}
        />
        <TextField
          required
          id="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          margin="normal"
          fullWidth={true}
          disabled={this.state.signingIn}
          onChange={(e) => this.setState({ password: e.target.value })}
        />
        <Button onClick={this.logIn}>Log In</Button>
      </div>
    );
  }

  logIn = async () => {

    this.goToSigningInState();

    try {
      var username = this.state.username;

      var response = await Api.authenticateAsync(this.state.username, this.state.password);

      // Success
      this.goToSignedInState();

    } catch (err) {
      this.goToErrorState(err.toString());
    }
  }

  goToSigningInState() {
    this.setState({
      signingIn: true,
      signedIn: false,
      error: null
    });
  }

  goToSignedInState() {
    this.setState({
      signingIn: false,
      signedIn: true,
      error: null
    });
  }

  goToErrorState(error: string) {
    this.setState({
      signingIn: false,
      signedIn: false,
      error: error
    });
  }
}

export default LogIn;