module TopicContainer
  extend ActiveSupport::Concern
  included do
    validates_presence_of :topic

    delegate :name,
             :description,
             :description_html,
             :description_teaser_html,
             :rebuild!,
             :lessons,
             :guides,
             :pending_guides,
             :lessons,
             :first_lesson,
             :locale,
             :exercises, to: :topic
  end
end