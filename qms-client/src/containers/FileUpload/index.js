// @flow

import React, { Component } from "react";
import api from "api";
import Dropzone from "react-dropzone";
import Tooltip from "@material-ui/core/Tooltip";
import DropZoneContent from "components/DropZoneContent";
import Typography from "@material-ui/core/Typography";
import {Button} from "@material-ui/core";

const config = { headers: { "Content-Type": "multipart/form-data" } };

type Props = {
  postUrl: string,
  showMessage: string => void,
  maxSize: number,
  accept?: Array<string>,
  onSuccess?: Object => void,
  rejectMessage: string,
  multiple: boolean,
  title: string
};

type State = {
  sending: boolean,
  uploaded: boolean,
  selected: boolean,
  uploadedFile: Object,
  formData: any,
};

class FileUpload extends Component<Props, State> {
  state: State;
  postFile: Object => void;
  onDropAccepted: (Array<Object>) => void;
  onDropRejected: (Array<Object>) => void;
  processFile: () => void;

  static defaultProps = {
    multiple: false,
    showMessage: () => {},
    maxSize: 1000000,
    rejectMessage: "We don't accept this type of files",
    accept: undefined,
    title: "Drop your files here or click to select"
  };

  constructor(props: Props) {
    super(props);
    this.postFile = this._postFile.bind(this);
    this.onDropAccepted = this._onDropAccepted.bind(this);
    this.onDropRejected = this._onDropRejected.bind(this);
    this.processFile = this._processFile.bind(this);
    this.state = {
      sending: false,
      uploaded: false,
      processed: false,
    };
  }

  redirectTo = (url: string) => {
    this.props.history.push("/" + url);
  };

  _postFile(file: Object) {
    const { postUrl, showMessage, onSuccess } = this.props;
    const ref = this;
    if (postUrl) {
      ref.setState({ sending: true });
      api
        .post(postUrl, file, config)
        .then(resp => {
          if (onSuccess) onSuccess(resp.data);
          ref.setState({
            sending: false,
            processed: true,
          });
        })
        .catch(err => {
          if(err && err.response && err.response.data) {
            showMessage(err.response.data.message);
          }
          console.error("err: ", err);
          ref.setState({ sending: false });
        });
    }
  }

  _processFile() {
    const {uploaded, formData} = this.state;
    const {showMessage} = this.props;
    if(uploaded){
      this.postFile(formData);
    }
    else {
      showMessage("No file to process");
    }
  }

  _onDropAccepted(acceptedFiles: Array<Object>) {
    if (acceptedFiles && Array.isArray(acceptedFiles)) {
      const file: any = this.props.multiple
        ? acceptedFiles
        : acceptedFiles.shift();
      var _formData = new FormData();
      _formData.append("file", file);
      this.setState({
        uploadedFile: file,
        uploaded: true,
        formData: _formData,
      });
      // console.log("acceptedFiles:",acceptedFiles);
    }
  }

  _onDropRejected(rejectedFiles: Array<Object>) {
    if (rejectedFiles && Array.isArray(rejectedFiles)) {
      const { showMessage } = this.props;
      showMessage(this.props.rejectMessage);
    }
  }

  render() {
    const { maxSize, accept, title } = this.props;
    const { sending, uploaded, uploadedFile } = this.state;
    return (
        <div>
          <Tooltip title={title} placement="top-start">
            <Dropzone
                onDropAccepted={this.onDropAccepted}
                onDropRejected={this.onDropRejected}
                disabled={sending}
                multiple={this.props.multiple}
                name="file-upload"
                maxSize={maxSize}
                accept={accept ? accept.toString() : undefined}
            >
              <DropZoneContent
                  sending={sending}
                  text="Drop or click to upload a file"
                  uploaded={uploaded}
                  file={uploadedFile}
              />
            </Dropzone>
          </Tooltip>
          <Button variant="contained"
                  color="primary"
                  style={{
                    marginTop: "5px"
                  }}
                  onClick={this.processFile}>
            Process (Parse)
          </Button>
        </div>
    );
  }
}

export default FileUpload;
