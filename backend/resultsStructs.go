package backend

// The result from opening a open file dialog. The following status codes exists
//
// open-file-dialog-error: Files is empty, Message contains the error
//
// open-file-dialog-cancelled: Files is empty, Message is empty
//
// open-file-dialog-success: Files contains a array of paths, Message is empty
type OpenFileDialogResult struct {
	Files      []string `json:"Files"`
	Message    string   `json:"Message"`
	StatusCode string   `json:"StatusCode"`
}

type MoveFileResult struct {
	File       string `json:"File"`
	Message    string `json:"Message"`
	StatusCode string `json:"StatusCode"`
}

type DeleteFileResult struct {
	Message    string `json:"Message"`
	StatusCode string `json:"StatusCode"`
}

type GetArchiveInfoResult struct {
	Json       string `json:"Json"`
	Message	   string `json:"Message"`
	StatusCode string `json:"StatusCode"`
}