require 'yui/compressor'

# Define the name of the output files.
module_name = 'hashtag'

# Where to put the output files.
output_dir  = 'dist'

# List the files. Can use FileList and globs.
js_files  = %w(hashtag.js)
css_files = %w(hashtag.css)

# Tasks

# Create output directory.
directory output_dir

%w(js css).each do |ext|
  # Input files.
  files = eval("#{ext}_files").map { |f| File.join ext, f }

  # Concatenate all files.
  single = File.join output_dir, "#{module_name}.#{ext}"
  file single => [output_dir, *files] do
    sh "cat #{files.join ' '} > #{single}"
  end

  # Minify with yui.
  compressed = File.join output_dir, "#{module_name}.min.#{ext}"
  file compressed => single do
    puts "yui-compressor #{single} -o #{compressed}"
    compressor = case ext
                 when 'js'  then YUI::JavaScriptCompressor.new munge: true
                 when 'css' then YUI::CssCompressor.new
                 end
    File.open(single, 'r') do |source|
      File.open(compressed, 'w') do |mini|
        mini << compressor.compress(source)
      end
    end
  end

  desc "Concatenates and minifies .#{ext} files"
  task ext => compressed
end

task :default => %i(js css)

desc "Removes the #{output_dir} directory"
task :clean do
  rm_rf output_dir
end

desc 'Starts Guard'
task :guard do
  sh 'bundle exec guard'
end
