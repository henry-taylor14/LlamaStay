package main

import (
	"log"
	"math"
	"net/http"
	"time"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/plugins/migratecmd"
	"github.com/pocketbase/pocketbase/tools/types"

	// Schema migrations register themselves via their init(); without this
	// blank import a fresh clone starts with an empty database and no
	// collections, and nothing reports why.
	_ "llamastay/migrations"
)

// Millimeters of wool a llama grows per day.
const mmPerDay = 0.3

func main() {
	app := pocketbase.New()

	migratecmd.MustRegister(app, app.RootCmd, migratecmd.Config{
		Automigrate: true,
	})

	registerSeedCommand(app)

	app.OnRecordCreate("llamas").BindFunc(func(e *core.RecordEvent) error {
		if e.Record.GetDateTime("lastShear").IsZero() {
			e.Record.Set("lastShear", types.NowDateTime())
		}
		return e.Next()
	})

	app.OnServe().BindFunc(func(se *core.ServeEvent) error {
		se.Router.POST("/api/llamas/{id}/shear", func(e *core.RequestEvent) error {
			record, err := e.App.FindRecordById("llamas", e.Request.PathValue("id"))
			if err != nil {
				return e.NotFoundError("Llama not found.", err)
			}

			amount := 0
			if last := record.GetDateTime("lastShear"); !last.IsZero() {
				// Floored once, so a partial day still contributes: at 3.9 days
				// this yields 1mm, where flooring the day count first yields 0.
				days := time.Since(last.Time()).Hours() / 24
				amount = int(math.Floor(days * mmPerDay))
			}

			record.Set("lastShearAmount", amount)
			record.Set("lastShear", types.NowDateTime())

			if err := e.App.Save(record); err != nil {
				return e.InternalServerError("Failed to record the shear.", err)
			}

			return e.JSON(http.StatusOK, record.PublicExport())
		})

		return se.Next()
	})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
