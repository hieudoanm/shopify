package cmd

import (
	"bufio"
	"fmt"
	"os"
	"strings"

	"shopify-cli/services"
	"shopify-cli/utils"

	"github.com/spf13/cobra"
)

var checkCmd = &cobra.Command{
	Use:   "check [url]",
	Short: "Check if a website is using Shopify or Shopify Plus",
	Args:  cobra.MaximumNArgs(1),
	Run: func(cmd *cobra.Command, args []string) {
		var url string

		if len(args) == 1 {
			url = args[0]
		} else {
			// Prompt user for input
			fmt.Print("Enter website URL: ")
			reader := bufio.NewReader(os.Stdin)
			input, err := reader.ReadString('\n')
			if err != nil {
				fmt.Fprintln(os.Stderr, utils.Red("❌ Failed to read input"))
				os.Exit(2)
			}
			url = strings.TrimSpace(input)
		}

		if url == "" {
			fmt.Fprintln(os.Stderr, utils.Red("❌ URL is required"))
			os.Exit(2)
		}

		if !strings.HasPrefix(url, "http://") && !strings.HasPrefix(url, "https://") {
			url = "https://" + url
		}

		isShopify, isPlus, signals, err := services.CheckShopify(url)
		if err != nil {
			fmt.Fprintln(os.Stderr, utils.Red("❌ Error:"), err)
			os.Exit(2)
		}

		if !isShopify {
			fmt.Println(utils.Red("✖ Shopify not detected"))
			os.Exit(1)
		}

		fmt.Println(utils.Green("✔ Shopify detected"))

		if isPlus {
			fmt.Println(utils.Green("✔ Shopify Plus detected"))
		} else {
			fmt.Println(utils.Yellow("ℹ Shopify Plus not detected"))
		}

		if verbose {
			fmt.Println(utils.Dim("\nSignals:"))
			for _, s := range signals {
				fmt.Println(utils.Dim(" - " + s))
			}
		}
	},
}

var verbose bool

func init() {
	storeCmd.AddCommand(checkCmd)

	checkCmd.Flags().BoolVarP(
		&verbose,
		"verbose",
		"v",
		false,
		"Show detection signals",
	)
}
