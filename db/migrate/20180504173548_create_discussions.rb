class CreateDiscussions < ActiveRecord::Migration[5.1]
  def change
    create_table :discussions do |t|
      t.integer :status
      t.string :title
      t.text :description
      t.references :initiator, index: true
      t.references :item, polymorphic: true, index: true
    end
  end
end
