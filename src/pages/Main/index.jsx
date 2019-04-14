import React, { Component } from 'react';
import api from '../../services/api';

import logo from '../../assets/logo.svg';

import { Container, SubmitButton } from './styles';

export default class Main extends Component {
  constructor() {
    super();
    this.state = { newBox: '' };

    this.handleSubmit = async (e) => {
      e.preventDefault();

      const { newBox } = this.state;
      const response = await api.post('boxes', {
        title: newBox,
      });

      const { _id } = response.data;

      // eslint-disable-next-line react/prop-types
      this.props.history.push(`/box/${_id}`);
    };

    this.handleInputChange = (e) => {
      this.setState({
        newBox: e.target.value,
      });
    };
  }

  render() {
    const { newBox } = this.state;

    return (
      <Container>
        <form onSubmit={this.handleSubmit}>
          <img src={logo} alt="" />
          <input
            placeholder="Criar um box"
            value={newBox}
            onChange={this.handleInputChange}
          />
          <SubmitButton type="submit">Criar</SubmitButton>
        </form>
      </Container>
    );
  }
}
