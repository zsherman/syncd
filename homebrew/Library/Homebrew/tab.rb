require 'ostruct'

require 'formula'
require 'vendor/multi_json'

# Inherit from OpenStruct to gain a generic initialization method that takes a
# hash and creates an attribute for each key and value. `Tab.new` probably
# should not be called directly, instead use one of the class methods like
# `Tab.for_install`.
class Tab < OpenStruct
  def self.for_install f, args
    sha = `cd '#{HOMEBREW_REPOSITORY}' && git rev-parse --verify -q HEAD 2>/dev/null`.chuzzle
    Tab.new :used_options => args.used_options(f),
            :unused_options => args.unused_options(f),
            :tabfile => f.prefix + "INSTALL_RECEIPT.json",
            :built_as_bottle => !!args.build_bottle?,
            :tapped_from => f.tap,
            :time => Time.now.to_i, # to_s would be better but Ruby has no from_s function :P
            :HEAD => sha
  end

  def self.from_file path
    tab = Tab.new MultiJson.decode(open(path).read)
    tab.tabfile = path
    return tab
  end

  def self.for_keg keg
    path = keg+'INSTALL_RECEIPT.json'

    if path.exist?
      self.from_file path
    else
      begin
        self.dummy_tab Formula.factory(keg.parent.basename)
      rescue FormulaUnavailableError
        Tab.new :used_options => [],
                :unused_options => [],
                :built_as_bottle => false,
                :tapped_from => "",
                :time => nil,
                :HEAD => nil
      end
    end
  end

  def self.for_formula f
    f = Formula.factory f unless f.kind_of? Formula
    path = f.linked_keg/'INSTALL_RECEIPT.json'

    if path.exist?
      self.from_file path
    else
      # Really should bail out with an error if a formula was not installed
      # with a Tab. However, there will be lots of legacy installs that have no
      # receipt---so we fabricate one that claims the formula was installed with
      # no options.
      #
      # TODO:
      # This isn't the best behavior---perhaps a future version of Homebrew can
      # treat missing Tabs as errors.
      self.dummy_tab f
    end
  end

  def self.dummy_tab f
    Tab.new :used_options => [],
            :unused_options => f.build.as_flags,
            :built_as_bottle => false,
            :tapped_from => "",
            :time => nil,
            :HEAD => nil
  end

  def installed_with? opt
    used_options.include? opt
  end

  def options
    used_options + unused_options
  end

  def to_json
    MultiJson.encode({
      :used_options => used_options,
      :unused_options => unused_options,
      :built_as_bottle => built_as_bottle,
      :tapped_from => tapped_from,
      :time => time,
      :HEAD => send("HEAD")})
  end

  def write
    tabfile.write to_json
  end
end
