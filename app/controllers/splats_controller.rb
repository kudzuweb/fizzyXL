class SplatsController < ApplicationController
  before_action :set_splat, only: %i[ show edit update ]

  def index
    if params[:category_id]
      @category = Category.find(params[:category_id])
      @splats = @category.splats
    else
      @splats = Splat.all
    end
  end

  def new
    @splat = Splat.new
  end

  def edit
  end

  def update
    @splat.update(splat_params)

    redirect_to splat_path(@splat)
  end

  def create
    Splat.create! splat_params

    redirect_to splats_path
  end

  def show
  end

  private
    def set_splat
      @splat = Splat.find(params[:id])
    end

    def splat_params
      params.require(:splat).permit(:title, :body, :color, :image, category_ids: [])
    end
end
