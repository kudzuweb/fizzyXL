require "application_system_test_case"

class CardSizesTest < ApplicationSystemTestCase
  test "sized cards have correct size class in board view" do
    sign_in_as(users(:david))

    visit board_url(boards(:writebook))

    # logo has size 'l', layout has 'm', text has 'xs'
    # Use visible: false since cards may be in collapsed sections
    assert_selector "#article_card_#{cards(:logo).id}.card--size-l", visible: false
    assert_selector "#article_card_#{cards(:layout).id}.card--size-m", visible: false
    assert_selector "#article_card_#{cards(:text).id}.card--size-xs", visible: false
  end

  test "unsized cards have default xs size class in board view" do
    sign_in_as(users(:david))

    visit board_url(boards(:writebook))

    # shipping has nil size, should default to xs
    assert_selector "#article_card_#{cards(:shipping).id}.card--size-xs", visible: false
  end

  private
    def sign_in_as(user)
      visit session_transfer_url(user.identity.transfer_id, script_name: nil)
      assert_selector "h1", text: "Latest Activity"
    end
end
