package main

import (
	"embed"

	"github.com/Densorius/mc-modmanager/backend"
)

//go:embed frontend/dist
var assets embed.FS

func main() {
	backend.Initialize(assets)
}
