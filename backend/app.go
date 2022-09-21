package backend

import (
	"context"
	"fmt"
	"os"

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

func (a *App) GetMods(path string) []string {
	var mods []string

	files, err := os.ReadDir(path)

	if err != nil {
		fmt.Printf("Error: %v\n", err);

		return nil
	}

	for _, file := range files {
		mods = append(mods, file.Name())
	}

	return mods
}

func (a *App) GetUserHomeDir() string {
	userHomeDirectory, err := os.UserHomeDir()

	if err != nil {
		fmt.Printf("error: %v\n", err)

		return ""
	}
	
	return userHomeDirectory
}

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