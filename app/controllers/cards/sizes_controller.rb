class Cards::SizesController < ApplicationController
  include CardScoped

  def create
    @card.set_size(params[:size])
    render_card_replacement
  end

  def destroy
    @card.unset_size
    render_card_replacement
  end
end
