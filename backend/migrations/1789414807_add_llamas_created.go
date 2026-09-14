package migrations

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("llamas")
		if err != nil {
			return err
		}

		// The ledger numbers entries in the order they were recorded, so the
		// list needs a stable ordering that name sorting cannot provide.
		collection.Fields.Add(&core.AutodateField{Name: "created", OnCreate: true})

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("llamas")
		if err != nil {
			return err
		}
		collection.Fields.RemoveByName("created")
		return app.Save(collection)
	})
}
