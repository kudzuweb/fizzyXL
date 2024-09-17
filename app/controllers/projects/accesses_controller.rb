class Projects::AccessesController < ApplicationController
  include ProjectScoped

  def edit
    @users = @project.users
  end

  def update
    update_access
    redirect_to project_access_url(@project)
  end

  private
    def update_access
      users = Current.account.users.active.find([ Current.user.id, *params[:user_ids] ])
      users.each { |user| @project.accesses.create_or_find_by!(user: user) }
      @project.accesses.where.not(user: users).destroy_all
    end
end
