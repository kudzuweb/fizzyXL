class AddSizeToCards < ActiveRecord::Migration[8.2]
  def change
    add_column :cards, :size, :string
    add_index :cards, [:board_id, :size]
  end
end
