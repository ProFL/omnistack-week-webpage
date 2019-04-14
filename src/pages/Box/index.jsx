import React, { Component } from 'react';
import { distanceInWords } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Dropzone from 'react-dropzone';
import socket from 'socket.io-client';

import { MdInsertDriveFile } from 'react-icons/md';
import api from '../../services/api';

import logo from '../../assets/logo.svg';
import './styles.css';

export default class Box extends Component {
  constructor() {
    super();
    this.state = { box: {} };

    this.subscribeToNewFiles = () => {
      // eslint-disable-next-line react/prop-types
      const { id } = this.props.match.params;
      const io = socket('https://oministack-week.herokuapp.com');

      io.emit('connectRoom', id);

      io.on('file', (data) => {
        this.setState(prevState => ({
          box: {
            ...prevState.box,
            files: [
              data,
              ...prevState.box.files,
            ],
          },
        }));
      });
    };

    this.handleUpload = (files) => {
      files.forEach((file) => {
        const payload = new FormData();
        payload.append('file', file);

        const { _id } = this.state.box;
        api.post(`boxes/${_id}/files`, payload);
      });
    };
  }

  async componentDidMount() {
    this.subscribeToNewFiles();

    // eslint-disable-next-line react/prop-types
    const { id } = this.props.match.params;
    const response = await api.get(`boxes/${id}`);

    this.setState({ box: response.data });
  }

  render() {
    const { box } = this.state;

    return (
      <div id="box-container">
        <header>
          <img src={logo} alt="" />
          <h1>{box.title}</h1>
        </header>

        <Dropzone onDropAccepted={this.handleUpload}>
          {({ getRootProps, getInputProps }) => (
            <div className="upload" {...getRootProps()}>
              <input {...getInputProps()} />
              <p>Arraste arquivos ou clique aqui</p>
            </div>
          )}
        </Dropzone>

        <ul>
          {
            box.files && box.files.map(file => (
              // eslint-disable-next-line no-underscore-dangle
              <li key={file._id}>
                <a className="fileInfo" href={file.url} rel="noopener noreferrer" target="_blank">
                  <MdInsertDriveFile size={24} color="#A5Cfff" />
                  <strong>{file.title}</strong>
                </a>

                <span>
há
                  {' '}
                  {distanceInWords(
                    file.createdAt,
                    new Date(),
                    { locale: pt },
                  )}

                </span>
              </li>
            ))
          }
        </ul>
      </div>
    );
  }
}
