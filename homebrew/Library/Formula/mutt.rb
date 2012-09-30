require 'formula'

class Mutt < Formula
  homepage 'http://www.mutt.org/'
  url 'ftp://ftp.mutt.org/mutt/devel/mutt-1.5.21.tar.gz'
  sha1 'a8475f2618ce5d5d33bff85c0affdf21ab1d76b9'

  depends_on 'tokyo-cabinet'
  depends_on 'slang' if ARGV.include? '--with-slang'

  def options
    [
      ['--enable-debug', "Build with debug option enabled"],
      ['--sidebar-patch', "Apply sidebar (folder list) patch"],
      ['--trash-patch', "Apply trash folder patch"],
      ['--with-slang', "Build against slang instead of ncurses"],
      ['--ignore-thread-patch', "Apply ignore-thread patch"],
      ['--pgp-verbose-mime-patch', "Apply PGP verbose mime patch"]
    ]
  end

  def patches
    urls = [
      ['--sidebar-patch', 'http://lunar-linux.org/~tchan/mutt/patch-1.5.21.sidebar.20120829.txt'],
      ['--trash-patch', 'http://patch-tracker.debian.org/patch/series/dl/mutt/1.5.21-6.2/features/trash-folder'],
      ['--ignore-thread-patch', 'http://ben.at.tanjero.com/patches/ignore-thread-1.5.21.patch'],
      ['--pgp-verbose-mime-patch',
          'http://patch-tracker.debian.org/patch/series/dl/mutt/1.5.21-6.2/features-old/patch-1.5.4.vk.pgp_verbose_mime'],
    ]

    p = []
    urls.each do |u|
      p << u[1] if ARGV.include? u[0]
    end
    return p
  end

  def install
    args = ["--disable-dependency-tracking",
            "--disable-warnings",
            "--prefix=#{prefix}",
            "--with-ssl",
            "--with-sasl",
            "--with-gnutls",
            "--with-gss",
            "--enable-imap",
            "--enable-smtp",
            "--enable-pop",
            "--enable-hcache",
            "--with-tokyocabinet",
            # This is just a trick to keep 'make install' from trying to chgrp
            # the mutt_dotlock file (which we can't do if we're running as an
            # unpriviledged user)
            "--with-homespool=.mbox"]
    args << "--with-slang" if ARGV.include? '--with-slang'

    if ARGV.include? '--enable-debug'
      args << "--enable-debug"
    else
      args << "--disable-debug"
    end

    system "./configure", *args
    system "make install"
  end
end
