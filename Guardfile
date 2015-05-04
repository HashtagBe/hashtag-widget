watched = %w(js css)

watched.each do |ext|
  guard :rake, task: ext do
    watch %r{^#{ext}/.+\.#{ext}$}
  end
end
