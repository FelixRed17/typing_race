class CreateRaces < ActiveRecord::Migration[8.1]
  def change
    create_table :races do |t|
      t.string :status, default: "waiting", null: false
      t.text :passage

      t.timestamps
    end
  end
end
