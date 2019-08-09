import React, { Component } from 'react';

import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Form, SubmitButton, Title, List } from './styles';
import Container from '../../components/Container';

import api from '../../services/api';

class Main extends Component {
  state = {
    newRepo: '',
    repositories: [],
    loading: false,
  };

  componentDidMount() {
    // busca os dados salvos
    const repositories = localStorage.getItem('repositories');

    // carrega
    if (repositories) {
      this.setState({ repositories: JSON.parse(repositories) });
    }
  }

  componentDidUpdate(_, prevState) {
    const { repositories } = this.state;

    if (prevState.repositories !== repositories) {
      localStorage.setItem('repositories', JSON.stringify(repositories));
    }
  }

  handleInputChange = e => {
    this.setState({ newRepo: e.target.value });
  };

  handleSubmit = async e => {
    e.preventDefault();
    // console.log(this.state.newRepo);

    this.setState({ loading: true });
    const { newRepo, repositories } = this.state;

    const response = await api.get(`/repos/${newRepo}`);
    // console.log(response.data);

    // O que eu quero guardar dessa requisição a api?
    const data = {
      name: response.data.full_name,
    };

    this.setState({
      repositories: [...repositories, data],
      newRepo: '', // depois de adiciona-lo, deixa-o vazio.
      loading: false,
    });
  };

  render() {
    const { newRepo, repositories, loading } = this.state;
    return (
      <>
        <Container>
          <Title>
            <FaGithubAlt />
            Repositórios
          </Title>

          <Form onSubmit={this.handleSubmit}>
            <input
              type="text"
              placeholder="Adicionar repositorio"
              value={newRepo}
              onChange={this.handleInputChange}
            />
            <SubmitButton loading={loading}>
              {loading ? (
                <FaSpinner color="#FFF" size={14} />
              ) : (
                <FaPlus color="#FFF" size={14} />
              )}
            </SubmitButton>
          </Form>
          <List>
            {repositories.map(repository => (
              <li key={repository.name}>
                <span>{repository.name}</span>
                <Link to={`/repository/${encodeURIComponent(repository.name)}`}>
                  Detalhes
                </Link>
              </li>
            ))}
          </List>
        </Container>
      </>
    );
  }
}

export default Main;
