require 'formula'

class NoBdb5 < Requirement
  def message; <<-EOS.undent
    This software can fail to compile when Berkeley-DB 5.x is installed.
    You may need to try:
      brew unlink berkeley-db
      brew install squid
      brew link berkeley-db
    EOS
  end

  def satisfied?
    f = Formula.factory("berkeley-db")
    not f.installed?
  end

  # Not fatal in case Squid starts working with a newer version of BDB.
  def fatal?
    false
  end
end

class Squid < Formula
  homepage 'http://www.squid-cache.org/'
  url 'http://www.squid-cache.org/Versions/v3/3.1/squid-3.1.20.tar.bz2'
  sha1 'caa8e65f5720dfd1bc4160946cdb86d9b23c20ab'

  depends_on NoBdb5.new

  def install
    system "./configure", "--disable-debug", "--disable-dependency-tracking",
                          "--prefix=#{prefix}",
                          "--localstatedir=#{var}"
    system "make install"
  end
end
