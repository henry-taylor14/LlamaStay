package main

import (
	"fmt"
	"time"

	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/types"
	"github.com/spf13/cobra"
)

type sample struct {
	name        string
	color       string
	daysAgo     int
	shearAmount int
}

// Offsets are relative to today rather than fixed dates, so the two overdue
// records stay overdue however long from now this is run.
var samples = []sample{
	{"Waffles", "Tan", 25, 340},
	{"Inca", "Black", 74, 290},
	{"Pip", "Gray", 456, 410},
	{"Saffron", "Yellow", 127, 220},
	{"Clementine", "Orange", 409, 500},
	{"Indigo", "Blue", 13, 180},
}

func registerSeedCommand(app *pocketbase.PocketBase) {
	app.RootCmd.AddCommand(&cobra.Command{
		Use:   "seed",
		Short: "Fill an empty ledger with sample llamas",
		Run: func(cmd *cobra.Command, args []string) {
			// Only `serve` applies migrations, so on a fresh clone the schema
			// does not exist yet. Build it here so seeding is the first thing
			// a new contributor can run.
			if err := app.RunAllMigrations(); err != nil {
				fmt.Println("Could not build the database schema:", err)
				return
			}

			collection, err := app.FindCollectionByNameOrId("llamas")
			if err != nil {
				fmt.Println("Could not find the llamas collection:", err)
				return
			}

			existing, err := app.CountRecords("llamas")
			if err != nil {
				fmt.Println("Could not read the ledger:", err)
				return
			}
			if existing > 0 {
				fmt.Printf("Ledger already has %d record(s); leaving it alone.\n", existing)
				return
			}

			base := time.Now().UTC().Add(-time.Duration(len(samples)) * time.Minute)

			for i, s := range samples {
				record := core.NewRecord(collection)
				record.Set("name", s.name)
				record.Set("color", s.color)
				record.Set("lastShear", dateDaysAgo(s.daysAgo))
				record.Set("lastShearAmount", s.shearAmount)

				if err := app.Save(record); err != nil {
					fmt.Printf("Could not add %s: %v\n", s.name, err)
					return
				}

				// Ledger numbers come from creation order, but these six are
				// written in the same millisecond, which leaves the order to
				// chance. Space them out so the book reads 001 to 006.
				stamp, _ := types.ParseDateTime(base.Add(time.Duration(i) * time.Minute))
				_, err := app.DB().
					NewQuery("UPDATE llamas SET created={:created} WHERE id={:id}").
					Bind(dbx.Params{"created": stamp.String(), "id": record.Id}).
					Execute()
				if err != nil {
					fmt.Printf("Could not order %s: %v\n", s.name, err)
					return
				}
			}

			fmt.Printf("Added %d llamas.\n", len(samples))
		},
	})
}

func dateDaysAgo(days int) types.DateTime {
	d, _ := types.ParseDateTime(time.Now().UTC().AddDate(0, 0, -days).Truncate(24 * time.Hour))
	return d
}
