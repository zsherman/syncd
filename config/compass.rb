# Require any additional compass plugins here.
project_type = :rails

retina_ext = File.join('./lib/', 'retina')
require File.join(retina_ext, 'lib', 'sass_extensions.rb')
add_import_path File.join(retina_ext, 'stylesheets')


