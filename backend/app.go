package backend

import (
	"context"
	"fmt"
	"os"
	"strings"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx context.Context
}

// The result from opening a open file dialog. The following status codes exists
//
// open-file-dialog-error: Files is empty, Message contains the error
//
// open-file-dialog-cancelled: Files is empty, Message is empty
//
// open-file-dialog-success: Files contains a array of paths, Message is empty
type OpenFileDialogResult struct {
	Files      []string `json:"Files"`
	Message    string `json:"Message"`
	StatusCode string `json:"StatusCode"`
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

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

// Gets a array of mods currently in the given directory path.
func (a *App) GetMods(path string) []string {
	var mods []string

	files, err := os.ReadDir(path)

	if err != nil {
		fmt.Printf("Error: %v\n", err);

		return nil
	}

	for _, file := range files {
		strSplitted := strings.Split(file.Name(), ".")
		extension   := strSplitted[len(strSplitted) - 1]

		if extension == "jar" || extension == "txt" {
			mods = append(mods, file.Name())
		}
	}

	return mods
}

// Gets the path of the user's home directory. 
// This method is used to give the abilty to get the user's home directory.
func (a *App) GetUserHomeDir() string {
	userHomeDirectory, err := os.UserHomeDir()

	if err != nil {
		fmt.Printf("error: %v\n", err)

		return ""
	}
	
	return userHomeDirectory
}

// Opens a open file dialog for the user to select .jar files.
//
// returns: array of strings containing paths of the selected files.
func (a *App) OpenFileDialog() OpenFileDialogResult {
	files, err := runtime.OpenMultipleFilesDialog(a.ctx, runtime.OpenDialogOptions{
		Title: "Select mods to add",
		Filters: []runtime.FileFilter{
			{
				DisplayName: "Jar files",
				Pattern: "*.jar",
			},
			{
				DisplayName: "Text files",
				Pattern: "*.txt",
			},
		},
	})

	if err != nil {
		return OpenFileDialogResult{
			Files: nil,
			Message: err.Error(),
			StatusCode: "open-file-dialog/error",
		}
	}

	if files == nil {
		return OpenFileDialogResult{
			Files: nil,
			Message: "",
			StatusCode: "open-file-dialog/cancelled",
		}
	}

	return OpenFileDialogResult{
		Files: files,
		Message: "",
		StatusCode: "open-file-dialog/success",
	}
}

// Moves a file to a given location.
//
// returns the name of the file that was moved.
func (a *App) MoveFile(source string, destination string) MoveFileResult {
	err := os.Rename(source, fmt.Sprintf("%s\\%s", destination, getFileNameFromPath(&source)))

	if err != nil {
		return MoveFileResult{
			File: "",
			Message: err.Error(),
			StatusCode: "file-move/error",
		}
	}

	return MoveFileResult{
		File: getFileNameFromPath(&source),
		Message: "",
		StatusCode: "file-move/success",
	}
}

// Deletes the specified file.
//
// Returns wheter the deletion is succesfull (true) or not (false).
func (a *App) DeleteFile(file string) DeleteFileResult {
	err := os.Remove(file)

	if (err != nil) {
		return DeleteFileResult{
			Message: err.Error(),
			StatusCode: "deletion/error",
		}
	}
 
	return DeleteFileResult{
		Message: "",
		StatusCode: "deletion/success",
	}
}

func getFileNameFromPath(path *string) string {
	pathSplit := strings.Split(*path, "\\")

	return pathSplit[len(pathSplit) - 1]
}