import * as React from 'react';
import LogIn from './LogIn';
import * as Responses from '../api/responses';
import CookiesHelper from '../helpers/cookiesHelper';

interface AuthorizedProps {
  children: React.ReactNode;
}

interface AuthorizedState {
  token: string | null;
}

export default class Authorized extends React.Component<AuthorizedProps, AuthorizedState> {
  constructor(props: AuthorizedProps) {
    super(props);

    this.state = {
      token: CookiesHelper.getCookie("token")
    };
  }

  render() {
    if (this.state.token !== null) {
      return this.props.children;// Says "children" doesn't exist
    }

    return (
      <LogIn onSuccess={this.onSuccessfulLogin}/>
    );
  }

  onSuccessfulLogin = (response: Responses.IAuthenticateResponse) => {
    CookiesHelper.setCookie("token", response.data.token, 365);
    this.setState({
      token: response.data.token
    });
  }

  static logOut() {
    CookiesHelper.deleteCookie("token");
    window.location.reload();
  }

  static getToken() {
    return CookiesHelper.getCookie("token");
  }
}