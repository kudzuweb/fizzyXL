class Cards::SizesController < ApplicationController
  include CardScoped

  def update
    @card.update!(size: params[:size])
    render_card_replacement
  end

  def destroy
    @card.update!(size: nil)
    render_card_replacement
  end
end
