import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import './Board.css';
import Card from './Card';
import NewCardForm from './NewCardForm';
import CARD_DATA from '../data/card-data.json';

class Board extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cards: [],
      errorMessage: null,
      // cards: CARD_DATA.cards,
    };
  }

  componentDidMount() {
    axios.get(`${this.props.url}/${this.props.boardName}/cards`)
      .then((response) => {
        this.setState({ cards: response.data });
        // console.log('response.data is', response.data)
      })
      .catch((error) => {
        this.setState({
          errorMessage: error.message
        })
        console.log(error.message)
      })
  }

  addCardCallback = (card) => {
    const cardData = {
      text: card.text,
      emoji: card.cardEmoji,
    };
    axios.post(`${this.props.url}/${this.props.boardName}/cards`, cardData)
      .then((response) => {
        console.log(card)
        let updatedCards = this.state.cards;
        updatedCards.unshift({ card });
        this.setState({
          cards: updatedCards
        });
        console.log(updatedCards);
      })
      .catch((error) => {
        this.setState({
          errorMessage: error.message,
        });
      });
  }

  deleteCardCallback = (cardId) => {
    console.log(cardId)
    //  console.log(card.id)
    axios.delete(`https://inspiration-board.herokuapp.com/cards/${cardId}`)
      .then((response) => {
        const newCardList = this.state.cards.filter(card => card.card.id !== cardId);

        this.setState({
          cards: newCardList
        });
      })
      .catch((error) => {
        this.setState({
          errorMessage: error.message,
        });
      });
  }

  render() {

    const errorSection = (this.state.errorMessage) ?
      (<section className="validation-errors-display">
        Error: {this.state.errorMessage}
      </section>) : null;


    const cardComponents = this.state.cards.map((card, i) => {
      return (
        // <div key={i} className="board">
          <Card
          key={i} 
            id={card.card.id}
            text={card.card.text}
            cardEmoji={card.card.emoji}
            deleteCardCallback={this.deleteCardCallback}
          />
        // </div>
      )
    });

    return (
      <section>
        <div>
          {errorSection}
        </div>
        <div >
          <NewCardForm addCardCallback={this.addCardCallback} />
        </div>
        <div className="board">
          {cardComponents}
        </div>
      </section>
    )
  }

}

Board.propTypes = {

};

export default Board;
