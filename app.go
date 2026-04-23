package main

import (
	"context"
	"encoding/json"
	"os"
	"path/filepath"
	"strings"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct holds the application state and context.
type App struct {
	ctx context.Context
}

// TrackInfo represents metadata about a single track, returned to the frontend.
type TrackInfo struct {
	Index int    `json:"index"`
	Name  string `json:"name"`
}

// AppSettings holds user preferences that are persisted to disk.
type AppSettings struct {
	LastDirectory string   `json:"lastDirectory"`
	RecentFiles   []string `json:"recentFiles"`
	Tempo         int      `json:"tempo"`
	Looping       bool     `json:"looping"`
	CountIn       bool     `json:"countIn"`
}

// NewApp creates a new App application struct.
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts.
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// OpenFileDialog opens a native file picker and returns the selected file's contents as a byte slice.
// Returns nil if the user cancels.
func (a *App) OpenFileDialog() []byte {
	settings := a.LoadSettings()

	selection, err := runtime.OpenFileDialog(a.ctx, runtime.OpenDialogOptions{
		Title: "Open Guitar Pro File",
		Filters: []runtime.FileFilter{
			{
				DisplayName: "Guitar Pro Files",
				Pattern:     "*.gp;*.gp3;*.gp4;*.gp5;*.gpx;*.gp7;*.musicxml;*.mxl;*.capx",
			},
		},
		DefaultDirectory: settings.LastDirectory,
	})
	if err != nil || selection == "" {
		return nil
	}

	data, err := os.ReadFile(selection)
	if err != nil {
		return nil
	}

	// Update settings with this file
	settings.LastDirectory = filepath.Dir(selection)
	a.addRecentFile(&settings, selection)
	a.SaveSettings(settings)

	return data
}

// GetRecentFiles returns the list of recently opened files.
func (a *App) GetRecentFiles() []string {
	settings := a.LoadSettings()
	return settings.RecentFiles
}

// OpenRecentFile reads and returns the contents of a previously opened file.
func (a *App) OpenRecentFile(path string) []byte {
	data, err := os.ReadFile(path)
	if err != nil {
		return nil
	}
	return data
}

// LoadSettings reads settings from the config file.
func (a *App) LoadSettings() AppSettings {
	settings := AppSettings{Tempo: 100}
	configPath := a.configPath()

	data, err := os.ReadFile(configPath)
	if err != nil {
		return settings
	}

	json.Unmarshal(data, &settings)
	return settings
}

// SaveSettings writes settings to the config file.
func (a *App) SaveSettings(settings AppSettings) {
	configPath := a.configPath()
	os.MkdirAll(filepath.Dir(configPath), 0755)

	data, err := json.MarshalIndent(settings, "", "  ")
	if err != nil {
		return
	}

	os.WriteFile(configPath, data, 0644)
}

// configPath returns the path to the settings JSON file.
func (a *App) configPath() string {
	configDir, err := os.UserConfigDir()
	if err != nil {
		configDir = "."
	}
	return filepath.Join(configDir, "tabplayer", "settings.json")
}

// addRecentFile adds a file path to the recent files list (max 10, no duplicates).
func (a *App) addRecentFile(settings *AppSettings, path string) {
	// Remove if already in list
	filtered := make([]string, 0, len(settings.RecentFiles))
	for _, f := range settings.RecentFiles {
		if !strings.EqualFold(f, path) {
			filtered = append(filtered, f)
		}
	}

	// Prepend
	settings.RecentFiles = append([]string{path}, filtered...)

	// Cap at 10
	if len(settings.RecentFiles) > 10 {
		settings.RecentFiles = settings.RecentFiles[:10]
	}
}
