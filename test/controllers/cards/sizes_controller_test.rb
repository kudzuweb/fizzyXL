require "test_helper"

class Cards::SizesControllerTest < ActionDispatch::IntegrationTest
  setup do
    sign_in_as :kevin
  end

  test "update" do
    assert_changes -> { cards(:shipping).reload.size }, from: nil, to: "xl" do
      patch card_size_path(cards(:shipping)), params: { size: "xl" }, as: :turbo_stream
      assert_card_container_rerendered(cards(:shipping))
    end
  end

  test "update to different size" do
    assert_changes -> { cards(:logo).reload.size }, from: "l", to: "s" do
      patch card_size_path(cards(:logo)), params: { size: "s" }, as: :turbo_stream
      assert_card_container_rerendered(cards(:logo))
    end
  end

  test "destroy" do
    assert_changes -> { cards(:logo).reload.size }, from: "l", to: nil do
      delete card_size_path(cards(:logo)), as: :turbo_stream
      assert_card_container_rerendered(cards(:logo))
    end
  end
end
