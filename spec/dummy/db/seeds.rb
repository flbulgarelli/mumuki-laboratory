require 'mumuki/domain/seed'

puts 'Importing Languages...'
Mumuki::Domain::Seed.languages_syncer.locate_and_import! :language, 'http://localhost:9292'
Mumuki::Domain::Seed.languages_syncer.locate_and_import! :language, 'https://text.runners.mumuki.io'

bridge = Mumukit::Bridge::Bibliotheca.new("http://bibliotheca-api.mumuki.io")

puts 'Calculating dependency content dependencies graph...'
book_slug = "mumukiproject/mumuki-libro-primaria"
topic_slugs = bridge.book(book_slug).indifferent_get :chapters
guide_slugs = topic_slugs.flat_map { |it| bridge.topic(it).indifferent_get :lessons }

guide_slugs.each do |it|
  puts "Importing guide #{it}..."
  Mumuki::Domain::Seed.contents_syncer.locate_and_import! :guide, it
end
topic_slugs.each do |it|
  puts "Importing topic #{it}..."
  Mumuki::Domain::Seed.contents_syncer.locate_and_import! :topic, it
end

puts "Importing book #{book_slug}..."
Mumuki::Domain::Seed.contents_syncer.locate_and_import! :book, book_slug

Organization.find_or_create_by!(name: 'base') do |org|
  org.contact_email = 'issues@mumuki.org'
  org.book = Book.find_by!(slug: book_slug)
  org.public = true
  org.login_methods = Mumukit::Login::Settings.login_methods
  org.locale = 'es'
end

Organization.find_or_create_by!(name: 'central')

User.find_or_create_by!(uid: 'dev.student@mumuki.org') do |user|
  user.permissions = {student: 'central/*'}
  user.first_name = 'user'
  user.last_name = 'murga'
  user.gender = :other
  user.birthdate = 31.years.ago
end

puts 'Generating offline tests...'
Exercise.where(language: Language.for_name('gobstones')).each do |exercise|
  next unless exercise.test

  test = YAML.load(exercise.test)
  next unless test['examples']

  examples = test['examples'].map do |example|
    {
      initialBoard: example['initial_board'],
      expectedBoard: example['final_board'],
      expectedError: example['error'],
      title: example['title']
    }.compact
  end

  exercise.update! offline_test: {
                    examples: examples,
                    options: { checkHeadPosition: test['check_head_position'].present? }
                  }
end
