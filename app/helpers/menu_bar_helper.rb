module MenuBarHelper
  def menu_bar_links
    [
      link_to_profile,
      link_to_classroom,
      link_to_bibliotheca,
      solve_discussions_link,
      user_discussions_link
    ]
  end

  def menu_bar_list_items
    menu_bar_links.compact.map { |link| li_tag(link) }.join.html_safe
  end

  def li_tag(link)
    content_tag :li, link
  end

  def link_to_profile
    li_tag menu_item('user-o', :profile, user_path)
  end

  def link_to_classroom
    link_to_application 'graduation-cap', :classroom_ui, :teacher_here?
  end

  def link_to_bibliotheca
    link_to_application :book, :bibliotheca_ui, :writer?
  end

  def link_to_application(icon, app_name, minimal_permissions)
    return unless current_user&.send(minimal_permissions)
    url = url_for_application(app_name)
    menu_item icon, app_name, url
  end

  def menu_item(icon, name, url)
    link_to fixed_fa_icon(icon, text: t(name)), url, role: 'menuitem', tabindex: '-1'
  end
end
