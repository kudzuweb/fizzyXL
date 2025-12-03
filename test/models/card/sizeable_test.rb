require "test_helper"

class Card::SizeableTest < ActiveSupport::TestCase
  setup do
    Current.session = sessions(:david)
  end

  test "card can have a size" do
    card = cards(:logo)
    card.update!(size: "m")
    assert_equal "m", card.size
    assert card.sized?
  end

  test "unsized card returns false for sized?" do
    card = cards(:shipping)
    assert_nil card.size
    assert_not card.sized?
  end

  test "size_class returns correct class for sized card" do
    card = cards(:logo)
    card.update!(size: "xl")
    assert_equal "card--size-xl", card.size_class
  end

  test "size_class returns xs class for unsized card" do
    card = cards(:shipping)
    assert_nil card.size
    assert_equal "card--size-xs", card.size_class
  end

  test "display_size returns uppercase size for sized card" do
    card = cards(:layout)
    assert_equal "M", card.display_size
  end

  test "display_size returns 'Unsized' for unsized card" do
    card = cards(:shipping)
    assert_equal "Unsized", card.display_size
  end

  test "validates size is in allowed list" do
    card = cards(:logo)
    card.size = "xxl"
    assert_not card.valid?
    assert_includes card.errors[:size], "is not included in the list"
  end

  test "allows blank size" do
    card = cards(:logo)
    card.size = ""
    assert card.valid?
  end

  test "allows nil size" do
    card = cards(:logo)
    card.size = nil
    assert card.valid?
  end

  test "scopes work correctly" do
    # logo has size 'l', layout has 'm', text has 'xs', shipping has nil
    assert_includes Card.sized, cards(:logo)
    assert_includes Card.sized, cards(:layout)
    assert_includes Card.sized, cards(:text)
    assert_not_includes Card.sized, cards(:shipping)

    assert_includes Card.unsized, cards(:shipping)
    assert_not_includes Card.unsized, cards(:logo)

    assert_includes Card.by_size("l"), cards(:logo)
    assert_not_includes Card.by_size("l"), cards(:layout)
  end

  test "by_size scope handles string and symbol input" do
    card = cards(:logo) # size: 'l'
    assert_includes Card.by_size("l"), card
    assert_includes Card.by_size(:l), card
  end

  test "by_size scope is case insensitive" do
    card = cards(:logo) # size: 'l'
    assert_includes Card.by_size("L"), card
  end
end
