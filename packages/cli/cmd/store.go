/*
Copyright © 2025 NAME HERE <EMAIL ADDRESS>
*/
package cmd

import (
	"fmt"

	"github.com/spf13/cobra"
)

// storeCmd represents the store command
var storeCmd = &cobra.Command{
	Use:   "store",
	Short: "Inspect an online store for Shopify usage",
	Long: `Inspect an online store to determine whether it is powered by Shopify
or Shopify Plus.

The store command provides tools to analyze a website and detect
Shopify-specific signals such as platform headers, scripts, and assets.

Common use cases:
  - Identify whether a store is built on Shopify
  - Check if a store is using Shopify Plus
  - Inspect detection signals for debugging or research

Examples:
  shopify-cli store check example.com
  shopify-cli store check example.com --verbose`,
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Println("store called")
	},
}

func init() {
	rootCmd.AddCommand(storeCmd)

	// Here you will define your flags and configuration settings.

	// Cobra supports Persistent Flags which will work for this command
	// and all subcommands, e.g.:
	// storeCmd.PersistentFlags().String("foo", "", "A help for foo")

	// Cobra supports local flags which will only run when this command
	// is called directly, e.g.:
	// storeCmd.Flags().BoolP("toggle", "t", false, "Help message for toggle")
}
