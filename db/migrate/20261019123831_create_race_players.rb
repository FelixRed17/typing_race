class CreateRacePlayers < ActiveRecord::Migration[8.1]
  def change
    create_table :race_players do |t|
      t.references :race, null: false, foreign_key: true
      t.string :player_name

      t.timestamps
    end
  end
end
