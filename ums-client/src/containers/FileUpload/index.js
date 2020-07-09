import React, { Component } from "react";
import Dropzone from "react-dropzone";
import Tooltip from "@material-ui/core/Tooltip";
import DropZoneContent from "../../components/DropZoneContent";
import XLSX from 'xlsx';
import api from "../../api";
import {Button} from "@material-ui/core";

type Props = {
  postUrl: string,
  keycloak: any,
  updateResponse: string => void,
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
  users: any,
};

class FileUpload extends Component<Props, State> {
  state: State;
  // postFile: Object => void;
  // onDropAccepted: (Array<Object>) => void;
  // onDropRejected: (Array<Object>) => void;
  // processFile: () => void;

  static defaultProps = {
    multiple: false,
    showMessage: () => {},
    maxSize: 10000000,
    rejectMessage: "We don't accept this type of files",
    accept: undefined,
    title: "Drop your files here or click to select"
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      sending: false,
      uploaded: false,
      processed: false,
      users: [],
    };
  }


  postFile = (file: Object) => {
    const { postUrl, showMessage, onSuccess } = this.props;
    // const this = this;
    if (postUrl) {
      this.setState({ sending: true });
      if (file) {
        var r = new FileReader();
        r.onload = e => {
          let contents = this.processExcel(e.target.result);
          this.setUsers(contents);
          this.setState({ users: contents });
          api
              .post(postUrl, contents,{headers: {
                  'Authorization': "Bearer " + this.props.keycloak.token,
                }})
              .then(resp => {
                if(resp && resp.data) {
                  console.log("importUsers resp.data: ", resp.data);
                  this.props.updateResponse(resp.data);
                }
                if (onSuccess) onSuccess();
                this.setState({
                  sending: false,
                  processed: true,
                });
              })
              .catch(err => {
                if(err && err.response && err.response.data ) {
                  showMessage(err.response.data.message);
                }
                console.error("err: ", err);
                this.setState({ sending: false });
              });
        }
        r.readAsBinaryString(file);
        this.setState({ sending: false});
      } else {
        console.log("Failed to load file");
      }
    }
  }

  setUsers = (contents) => {
    this.setState((state, props) => ({
      users: contents,
        }));
  }

  processExcel = (data) =>  {
    var workbook = XLSX.read(data, {
      type: 'binary', sheetRows: 200,
    });
    var firstSheet = workbook.SheetNames[0];
    let result = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheet], {
      header: 2, blankrows: false,
    });
    // var data = this.to_json(workbook);
    return result;
  };

  to_json = (workbook) => {
    var result = {};
    workbook.SheetNames.forEach(function(sheetName) {
      var roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
        header: 1, blankrows: false,
      });
      if (roa.length) result[sheetName] = roa;
    });
    return result; //JSON.stringify(result, 2, 2);
  };

  processFile = () => {
    const {uploaded, formData, uploadedFile} = this.state;
    const {showMessage} = this.props;
    if(uploaded){
      this.postFile(uploadedFile);
    }
    else {
      showMessage("No file to process");
    }
  }

  onDropAccepted = (acceptedFiles: Array<Object>) => {
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

  onDropRejected = (rejectedFiles: Array<Object>) => {
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
