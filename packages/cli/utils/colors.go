package utils

import (
	"os"

	"golang.org/x/term"
)

var enableColor = term.IsTerminal(int(os.Stdout.Fd()))

func Green(s string) string {
	if !enableColor {
		return s
	}
	return "\033[32m" + s + "\033[0m"
}

func Red(s string) string {
	if !enableColor {
		return s
	}
	return "\033[31m" + s + "\033[0m"
}

func Yellow(s string) string {
	if !enableColor {
		return s
	}
	return "\033[33m" + s + "\033[0m"
}

func Dim(s string) string {
	if !enableColor {
		return s
	}
	return "\033[2m" + s + "\033[0m"
}
