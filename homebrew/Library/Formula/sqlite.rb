require 'formula'

class SqliteFunctions < Formula
  url 'http://www.sqlite.org/contrib/download/extension-functions.c?get=25', :using  => :nounzip
  sha1 'c68fa706d6d9ff98608044c00212473f9c14892f'
  version '2010-01-06'
end

class SqliteDocs < Formula
  url 'http://www.sqlite.org/sqlite-doc-3071400.zip'
  sha1 '38a8e9a4fa515f7aa6df7d31e58bd0ec60658031'
  version '3.7.14'
end

class Sqlite < Formula
  homepage 'http://sqlite.org/'
  url 'http://sqlite.org/sqlite-autoconf-3071400.tar.gz'
  sha1 '7b429809918201555f4c0fa639183a1c663d3fe0'
  version '3.7.14'

  depends_on 'readline' => :recommended

  option :universal
  option 'with-docs', 'Install HTML documentation'
  option 'without-rtree' 'Disable the R*Tree index module'
  option 'with-fts', 'Enable the FTS module'
  option 'with-functions', 'Enable more math and string functions for SQL queries'

  def install
    ENV.append 'CPPFLAGS', "-DSQLITE_ENABLE_RTREE" unless build.include? "without-rtree"
    ENV.append 'CPPFLAGS', "-DSQLITE_ENABLE_FTS3 -DSQLITE_ENABLE_FTS3_PARENTHESIS" if build.include? "with-fts"

    # enable these options by default
    ENV.append 'CPPFLAGS', "-DSQLITE_ENABLE_COLUMN_METADATA"
    ENV.append 'CPPFLAGS', "-DSQLITE_ENABLE_STAT3"

    ENV.universal_binary if build.universal?

    system "./configure", "--prefix=#{prefix}", "--disable-dependency-tracking", "--enable-dynamic-extensions"
    system "make install"

    if build.include? "with-functions"
      SqliteFunctions.new.brew { mv 'extension-functions.c?get=25', buildpath/'extension-functions.c' }
      system ENV.cc, "-fno-common",
                     "-dynamiclib",
                     "extension-functions.c",
                     "-o", "libsqlitefunctions.dylib",
                     *ENV.cflags.split
      lib.install "libsqlitefunctions.dylib"
    end

    SqliteDocs.new.brew { doc.install Dir['*'] } if build.include? "with-docs"
  end

  def caveats
    if build.include? 'with-functions' then <<-EOS.undent
      Usage instructions for applications calling the sqlite3 API functions:

        In your application, call sqlite3_enable_load_extension(db,1) to
        allow loading external libraries.  Then load the library libsqlitefunctions
        using sqlite3_load_extension; the third argument should be 0.
        See http://www.sqlite.org/cvstrac/wiki?p=LoadableExtensions.
        Select statements may now use these functions, as in
        SELECT cos(radians(inclination)) FROM satsum WHERE satnum = 25544;

      Usage instructions for the sqlite3 program:

        If the program is built so that loading extensions is permitted,
        the following will work:
         sqlite> SELECT load_extension('#{lib}/libsqlitefunctions.dylib');
         sqlite> select cos(radians(45));
         0.707106781186548
      EOS
    end
  end
end
