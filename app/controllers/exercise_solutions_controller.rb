class ExerciseSolutionsController < AjaxController
  include NestedInExercise
  include WithExamsValidations
  include WithResultsRendering

  before_action :set_messages, only: :create
  before_action :validate_user, only: :create

  def create
    assignment = @exercise.submit_solution!(current_user, solution_params)
    render_json assignment, status: assignment.status
  end

  private

  def validate_user
    validate_accessible @exercise.navigable_parent
  end

  def set_messages
    @messages = @exercise.messages_for(current_user)
  end

  def solution_params
    { content: params.require(:solution).permit!.to_h[:content] }
  end
end
