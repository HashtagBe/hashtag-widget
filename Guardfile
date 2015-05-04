watched = %w(js css)

watched.each do |ext|
  guard :rake, task: ext do
    watch %r{^#{ext}/.+\.#{ext}$}
  end
end

guard :livereload, port: 34567 do
  watch %r{^dist/.+\.(css|js)$}
  watch %r{^index\.html$}
end
