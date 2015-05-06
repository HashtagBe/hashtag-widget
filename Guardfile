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

if system('jshint')
  guard :shell do
    watch %r{^js/.+\.js} do |m|
      lint = `jshint #{m[0]}`
      n lint, m[0], :failed unless lint.empty?
    end
  end
end
