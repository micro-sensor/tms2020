# FileUpload

Custom file uploader that uses HTML5 dropzone and posts dropped files as MultipartFormInput to the server. You can specify custom parameters such as MIME types accepted or maximum size. Uses [react-dropzone](https://react-dropzone.netlify.com/) under the hood.

## Props

| Name          | Type           | Default | Description                                         |
| ------------- | -------------- | ------- | --------------------------------------------------- |
| postUrl*      | string         |         | Server endpoint to post a file.                     |
| maxSize       | number         |         | Maximum size of file in bytes                       |
| accept        | Array<string>  |         | Array of mimetypes accepted                         |
| onSuccess     | Object => void |         | On success callback. Provides server response data. |
| rejectMessage | string         |         | Message to show on rejected file                    |
| multiple      | boolean        | false   | Whether uploading multiple files is allowed.        |
| title         | string         |         | Title                                               |


## Usage

```sh
import React from "react";
import FileUpload from "containers/FileUpload";

const PDFFileUploadDemo = () => {
    return <FileUpload
        postUrl={resources.DataPOST.PERSONAL_FILES}
        showMessage={this.props.showMessage}
        accept={["application/pdf"]}
        rejectMessage="We only accept .pdf files"
    />
}
```
