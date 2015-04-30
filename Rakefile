require 'yui/compressor'

module_name = 'hashtag'
output_dir  = 'dist'

directory output_dir

%w(js css).each do |ext|
  files = FileList["#{ext}/*.#{ext}"]
  single = File.join output_dir, "#{module_name}.#{ext}"

  file single => [output_dir, files] do
    sh "cat #{files.join ' '} > #{single}"
  end

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

  task ext => compressed
end

task :default => %i(js css)

task :clean do
  rm_rf output_dir
end
