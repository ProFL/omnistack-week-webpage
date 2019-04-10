import React, { Component } from "react";
import api from "../../services/api";
import { distanceInWords } from "date-fns";
import pt from "date-fns/locale/pt";
import Dropzone from "react-dropzone";
import socket from "socket.io-client";

import { MdInsertDriveFile } from "react-icons/md";

import logo from "../../assets/logo.svg";
import "./styles.css";

export default class Box extends Component {
  state = {
    box: {}
  };

  async componentDidMount() {
    this.subscribeToNewFiles();

    const { id } = this.props.match.params;
    const response = await api.get(`boxes/${id}`);

    this.setState({box: response.data});
  }

  subscribeToNewFiles = () => {
    const { id } = this.props.match.params;
    const io = socket("https://oministack-week.herokuapp.com");

    io.emit("connectRoom", id);

    io.on("file", data => {
      this.setState({ box: {
        ...this.state.box,
        files: [
          data,
          ...this.state.box.files
        ]
      }});
    });
  }

  handleUpload = (files) => {
    files.forEach((file) => {
      const payload = new FormData();
      payload.append("file", file);

      api.post(`boxes/${this.state.box._id}/files`, payload);
    });
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
          {({getRootProps, getInputProps}) => (
            <div className="upload" {...getRootProps()}>
              <input {...getInputProps()} />
              <p>Arraste arquivos ou clique aqui</p>
            </div>
          )}
        </Dropzone>

        <ul>
          {
            box.files && box.files.map((file) => (
              <li key={file._id}>
                <a className="fileInfo" href={file.url} target="_blank">
                  <MdInsertDriveFile size={24} color="#A5Cfff" />
                  <strong>{file.title}</strong>
                </a>

                <span>há {distanceInWords(
                  file.createdAt,
                  new Date(),
                  {locale: pt}
                )}</span>
              </li>
            ))
          }
        </ul>
      </div>
    );
  }
}
