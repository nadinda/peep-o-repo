# Peep-o-repo

It's live! [Peep-o-Repo](https://peep-o-repo.netlify.com/)

Peep-o-repo is a simple machine whose job is to find you the project you have been written down on your notes or just suddenly have in mind. Just type the keywords and woosh it will show you a list of github repositories related to it. You can pick one from the list, see a brief description about it. If you like, you can also add it to your collection for your future reference.

## Getting Started

This is my first exploration to use GraphQL. Want to do something similar and hack around it? Follow these steps to get it set up and run it on your own local machine.

### Prerequisites

* Install `Node <https://nodejs.org/en/>`_.

    If the installation was successful, you should be able to run the following command.

    $ node --version
    v13.2.0

    $ npm --version
    6.13.1


### Installation

On your terminal

    $ git clone https://github.com/nadinda/peep-o-repo
    $ cd peep-o-repo
    $ npm install

### Create Local Environment Variable

1. Create your own Github Personal Access Token

    Follow the instructions from Github 
    
    https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line

2. Create Root/.env

    In your project directory folder
    * Create a new .env file in the root
    * Add this line of code to your .env file
        ```
        REACT_APP_TOKEN=yourGithubPersonalAccessTokenHere
        ```

## Running the project

    $ npm start
    
    when you modify the .env
    $ npm run start

## Built With

* [GraphQL](https://graphql.org/) - Query language for fetching Github v4 API
* [Apollo](https://www.apollographql.com/) - GraphQL integration
* [React](https://reactjs.org/) - The frontend framework used
* [Semantic-UI](https://react.semantic-ui.com) - UI components library

## About Author

* **E Nadinda Rachmat** - **Hire Me!** - [Connect with me on Linkedin](https://www.linkedin.com/in/eraulianr/)

## Acknowledgments

* Heartbeat Medical to get me to learn graphql