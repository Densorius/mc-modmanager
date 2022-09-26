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

		if strSplitted[len(strSplitted) - 1] == "jar" {
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
func (a *App) OpenFileDialog() []string {
	files, err := runtime.OpenMultipleFilesDialog(a.ctx, runtime.OpenDialogOptions{
		Title: "Select mods to add",
		Filters: []runtime.FileFilter{
			{
				DisplayName: ".jar",
				Pattern: "*.jar",
			},
		},
	})

	if err != nil {
		return nil
	}

	return files
}

// Moves a given array of files to a selected location.
//
// Returns a slice of the filenames that were moved.
func (a *App) MoveFiles(source []string, destination string) []string {
	var movedFiles = []string{}

	for _, file := range source {
		// move file to new location
		err := os.Rename(file, fmt.Sprintf("%s\\%s", destination, getFileNameFromPath(file)))

		if err != nil {
			fmt.Println(err);
			return nil
		}

		movedFiles = append(movedFiles, getFileNameFromPath(file))
	}

	return movedFiles
}

// Moves a file to a given location
//
// returns the name of the file that was moved.
func (a *App) MoveFile(source string, destination string) string {
	err := os.Rename(source, fmt.Sprintf("%s\\%s", destination, getFileNameFromPath(source)))

	if err == nil {
		return ""
	}

	return getFileNameFromPath(destination)
}

func getFileNameFromPath(path string) string {
	pathSplit := strings.Split(path, "\\")

	return pathSplit[len(pathSplit) - 1]
}