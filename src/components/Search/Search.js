import React, { Component } from 'react';
import { withApollo } from 'react-apollo'
import gql from 'graphql-tag';

import './Search.css';


const SEARCH_QUERY = gql`
query SearchByRepositoryName($searchQuery: String!) {
    search(query: $searchQuery, type: REPOSITORY, first: 10) {
      repositoryCount
      edges {
        node {
          ... on Repository {
            id
            name
            url
            owner{
              avatarUrl
              login
            }
            nameWithOwner
            descriptionHTML
            stargazers {
              totalCount
            }
            forks {
              totalCount
            }
            watchers{
              totalCount
            }
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchQuery: '',
      results: [],
      activeSuggestion: 0,
      showSuggestions: false,
      typeTimeOut: 0,
      showModal: undefined,
      loading: false,
    }
  }

  onInputChange = e => {
    this.setState({
      searchQuery: this.search.value,
      loading: true,
    }, () => {
      if (this.typeTimeOut) clearTimeout(this.typeTimeOut);
      this.typeTimeOut = setTimeout(() => {
        this.executeSearch()
      }, 1000)
    })
  }

  onClickSuggestion = selectedIdx => c => {
    this.setState({
      activeSuggestion: 0,
      showSuggestions: false,
      searchQuery: c.currentTarget.innerText,
    });
    this.showRepoModal(selectedIdx)
  };

  toggleHover = selectedIdx => c => {
    this.setState({ activeSuggestion: selectedIdx })
  }

  onKeyDown = e => {
    const { activeSuggestion, results } = this.state;

    // User pressed the enter key
    if (e.keyCode === 13) {
      e.preventDefault()
      this.showRepoModal(activeSuggestion)
      this.setState({
        activeSuggestion: 0,
        showSuggestions: false,
        searchQuery: results.edges[activeSuggestion]
      });
    }
    // User pressed the up arrow
    else if (e.keyCode === 38) {
      if (activeSuggestion === 0) {
        return;
      }
      this.setState({ activeSuggestion: activeSuggestion - 1 });
    }
    // User pressed the down arrow
    else if (e.keyCode === 40) {
      this.setState({ activeSuggestion: Math.min(activeSuggestion + 1, results.edges.length - 1) });
    }
  };

  executeSearch = async () => {
    const { searchQuery } = this.state
    const result = await this.props.client.query({
      query: SEARCH_QUERY,
      variables: { searchQuery },
    })
    this.setState({
      results: result.data.search,
      loading: false,
    })
  }

  showRepoModal = (selectedIdx) => {
    this.setState({ showModal: selectedIdx });
  };

  hideRepoModal = () => {
    this.setState({ showModal: undefined });
  };

  addToCollection = () => {
    const repo = this.state.results.edges || []
    const index = this.state.showModal
    const savedRepo = {
      avatarUrl: repo[index].node.owner.avatarUrl,
      owner: repo[index].node.owner.login,
      name: repo[index].node.name,
      url: repo[index].node.url,
      forks: repo[index].node.forks.totalCount,
      watchers: repo[index].node.watchers.totalCount,
      stargazers: repo[index].node.stargazers.totalCount,
    }
    this.props.addToCollection(savedRepo)
    this.search.value = ''
    this.setState({
      searchQuery: '',
      results: []
    })
    this.hideRepoModal()
  }

  render() {
    const repo = this.state.results.edges || []
    return (
      <div>
        <div className="search">
          <input
            type="text"
            placeholder="Type here to search Github Repositories..."
            ref={input => this.search = input}
            value={this.searchQuery}
            onChange={this.onInputChange}
            onKeyDown={this.onKeyDown}
            className={this.state.loading ? 'loading' : undefined}
          />
        </div>

        <ul className="suggestions">
          {repo.map((rep, index) => {
            let className;

            // Give active suggestion index with a class name
            if (index === this.state.activeSuggestion) {
              className = "suggestion-active";
            }
            return <li
              className={className}
              key={rep.node.id}
              onClick={this.onClickSuggestion(index)}
              onMouseEnter={this.toggleHover(index)}
            >
              {rep.node.nameWithOwner}
            </li>
          })}
        </ul>
        {this.state.showModal !== undefined && repo[this.state.showModal] && <Modal showModal={this.state.showModal !== undefined} handleClose={this.hideRepoModal} handleAdd={this.addToCollection} >

          <div className="container">
            <img src={repo[this.state.showModal].node.owner.avatarUrl} alt="Avatar"></img>
            <h4><b>{repo[this.state.showModal].node.nameWithOwner}</b></h4>
            <p>Forks: {repo[this.state.showModal].node.forks.totalCount}</p>
            <p>Watchers: {repo[this.state.showModal].node.watchers.totalCount}</p>
            <p>Stargazers: {repo[this.state.showModal].node.stargazers.totalCount}</p>
          </div>
        </Modal>}
      </div>
    );
  }
}

const Modal = ({ handleClose, showModal, handleAdd, children }) => {
  return (
    <div className={showModal ? 'modal display-block' : 'modal display-none'}>
      <section className='modal-main'>
        {children}
        <div className='modal buttons'>
          <button
            className='add'
            onClick={handleAdd}
          >
            Add to Collection
          </button>
          <button
            className='close'
            onClick={handleClose}
          >
            Cancel
          </button>
        </div>
      </section>
    </div>
  );
};

export default withApollo(Search)