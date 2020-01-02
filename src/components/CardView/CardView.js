import React from 'react';
import { Card, Image, Button } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css'
import './CardView.css'

const CardView = ({ avatarUrl, owner, name, forks, watchers, stargazers, showButtons, onMouseEnter, onMouseLeave, onDelete, onCardClick }) => (
    <Card
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
    >
        <Image
            wrapped ui={false}
            src={avatarUrl}
        />
        <Card.Content>
            <Card.Header>{name}</Card.Header>
            <Card.Meta>
                <span>{owner}</span>
            </Card.Meta>
            <Card.Description>
                <p>Forks: {forks}</p>
                <p>Watchers: {watchers}</p>
                <p>Stargazers: {stargazers}</p>
            </Card.Description>
        </Card.Content>
        {showButtons &&
            <Card.Content extra>
                <div className='ui two buttons'>
                    <Button
                        className="visit"
                        onClick={onCardClick}
                    >
                        Visit
                    </Button>
                    <Button
                        className="delete"
                        onClick={onDelete}
                    >
                        Delete
                    </Button>
                </div>
            </Card.Content>
        }
    </Card>
)

export default CardView