module Mumuki::Laboratory::Status::Discussion::PendingReview
  extend Mumuki::Laboratory::Status::Discussion

  def self.pending_review?
    true
  end

  def self.reachable_statuses_for_moderator(*)
    [Mumuki::Laboratory::Status::Discussion::Closed, Mumuki::Laboratory::Status::Discussion::Solved]
  end

  def self.iconize
    {class: :info, type: 'hourglass'}
  end
end