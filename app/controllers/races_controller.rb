class RacesController < ApplicationController
  def index
    @races = Race.order(created_at: :desc)
  end

  def create
    race = Race.new(
      passage: "The quick brown fox jumps over the lazy dog"
    )

    if race.save
      redirect_to root_path, notice: "Race created successfully!"
    else
      redirect_to root_path, alert: "Failed to create race."
    end
  end

  def show
    @race = Race.find(params[:id])
  end
end
