package migrations

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
	"github.com/pocketbase/pocketbase/tools/types"
)

func init() {
	m.Register(func(app core.App) error {
		collection := core.NewBaseCollection("llamas")

		collection.Fields.Add(
			&core.TextField{Name: "name", Required: true, Max: 100},
			&core.SelectField{
				Name:      "color",
				MaxSelect: 1,
				// Mirrors FIBER_COLORS in frontend/src/lib/llama.js.
				Values: []string{
					"Red", "Orange", "Yellow", "Green", "Blue", "Purple",
					"Black", "White", "Gray", "Brown", "Tan",
				},
			},
			&core.DateField{Name: "lastShear"},
			&core.NumberField{Name: "lastShearAmount", OnlyInt: true},
		)

		// Public access for local development only. An empty rule means anyone
		// who can reach the server may read and write; add auth before exposing
		// this beyond localhost.
		collection.ListRule = types.Pointer("")
		collection.ViewRule = types.Pointer("")
		collection.CreateRule = types.Pointer("")
		collection.UpdateRule = types.Pointer("")
		collection.DeleteRule = types.Pointer("")

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("llamas")
		if err != nil {
			return err
		}
		return app.Delete(collection)
	})
}
