require 'formula'

class Gearman < Formula
  homepage 'http://gearman.org/'
  url 'https://launchpad.net/gearmand/1.0/0.37/+download/gearmand-0.37.tar.gz'
  sha1 'e2bdd3557cf65337ecd22b4fafff285e24c83a7d'

  depends_on 'pkg-config' => :build
  depends_on 'boost'
  depends_on 'libevent'
  depends_on 'ossp-uuid'

  def install
    system "./configure", "--prefix=#{prefix}", "--without-mysql"
    system "make install"
  end

  def caveats; <<-EOS.undent
    If this is your first install, automatically load on login with:
        mkdir -p ~/Library/LaunchAgents
        cp #{plist_path} ~/Library/LaunchAgents/
        launchctl load -w ~/Library/LaunchAgents/#{plist_path.basename}

    If this is an upgrade and you already have the #{plist_path.basename} loaded:
        launchctl unload -w ~/Library/LaunchAgents/#{plist_path.basename}
        cp #{plist_path} ~/Library/LaunchAgents/
        launchctl load -w ~/Library/LaunchAgents/#{plist_path.basename}

      To start gearmand manually:
        gearmand -d
    EOS
  end

  def startup_plist; <<-EOPLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple Computer//DTD PLIST 1.0//EN"
"http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <key>Label</key>
    <string>#{plist_name}</string>
    <key>Program</key>
    <string>#{sbin}/gearmand</string>
    <key>RunAtLoad</key>
    <true/>
    <key>UserName</key>
    <string>#{`whoami`.chomp}</string>
  </dict>
</plist>
    EOPLIST
  end
end
