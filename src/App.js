import React, { Component } from 'react';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from 'react-apollo';

import logo from './logo.svg';
import './App.css';

import Search from './components/Search/Search';
import CardView from './components/CardView/CardView';

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'https://api.github.com/graphql',
    headers: {
      Authorization: `token ${process.env.REACT_APP_TOKEN}`,
    },
  }),
  cache: new InMemoryCache(),
});

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      showCardButtons: false,
    }

    if (localStorage.getItem('locallySavedRepo') === null) {
      this.state = {
        savedRepoList: [],
      }
    } else {
      const savedRepoList = JSON.parse(localStorage.getItem('locallySavedRepo'));
      this.state = {
        savedRepoList: savedRepoList,
      }
    }
  }

  addToCollection = newRepo => {
    this.state.savedRepoList.push(newRepo)
    this.setState({ savedRepoList: this.state.savedRepoList })
    localStorage.setItem('locallySavedRepo', JSON.stringify(this.state.savedRepoList));
  }

  onCardButtonsActive = selectedIdx => () => {
    this.setState({ showCardButtons: selectedIdx })
  }

  onCardButtonsInactive = () => {
    this.setState({ showCardButtons: false })
  }

  onCardDelete = selectedIdx => () => {
    const updatedList = this.state.savedRepoList.filter((_, index) => index !== selectedIdx)
    this.setState({ savedRepoList: updatedList })
    localStorage.setItem('locallySavedRepo', JSON.stringify(this.state.savedRepoList));
  }

  redirectGithub = selectedIdx => () => {
    const repoUrl = this.state.savedRepoList[selectedIdx].url
    window.open(repoUrl,'_blank');
  }

  render() {
    const { savedRepoList } = this.state
    return (
      <ApolloProvider client={client}>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Welcome to Peep-O-Repo</h1>
          </header>
          <p className="App-intro">
            You can find any repositories on Github and add it to your collection
          </p>
          <Search addToCollection={this.addToCollection} />
          {savedRepoList.length > 0 &&
            <div className="collection">
              <h1>
                Collection of Saved Repositories
              </h1>
            
              {savedRepoList.map((repo, index) =>
                <CardView
                  avatarUrl={repo.avatarUrl}
                  owner={repo.owner}
                  name={repo.name}
                  forks={repo.forks}
                  watchers={repo.watchers}
                  stargazers={repo.stargazers}
                  showButtons={this.state.showCardButtons === index}
                  onMouseEnter={this.onCardButtonsActive(index)}
                  onMouseLeave={this.onCardButtonsInactive}
                  onDelete={this.onCardDelete(index)}
                  onCardClick={this.redirectGithub(index)}
                />
              )}
              </div>
          }
        </div>
      </ApolloProvider>
    );
  }
}

export default App;
