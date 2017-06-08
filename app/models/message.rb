class Message < ActiveRecord::Base

  self.inheritance_column = :_type_disabled

  belongs_to :exercise
  belongs_to :assignment, foreign_key: :submission_id, primary_key: :submission_id

  validates_presence_of :exercise_id, :submission_id, :content, :sender

  markdown_on :content

  def notify!
    Mumukit::Nuntius.notify! 'student-messages', event_json
  end

  def event_json
    as_json(except: [:id, :exercise_id, :type],
            include: {exercise: {only: [:bibliotheca_id]}})
      .merge(organization: Organization.current.name)
  end

  def read!
    update! read: true
  end

  def self.parse_json(json)
    message = json.delete 'message'
    json
      .except('uid')
      .merge(message)
  end

  def self.read_all!
    update_all read: true
  end

  def self.import_from_json!(json)
    message_data = Message.parse_json json
    Organization.find_by!(name: message_data.delete('organization')).switch!
    Assignment
      .find_by(submission_id: message_data.delete('submission_id'))&.receive_answer! message_data if message_data['submission_id'].present?
  end
end
