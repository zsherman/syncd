# some credit to https://github.com/maddox/magick-installer
require 'formula'

def ghostscript_srsly?
  build.include? 'with-ghostscript'
end

def ghostscript_fonts?
  File.directory? "#{HOMEBREW_PREFIX}/share/ghostscript/fonts"
end

class Imagemagick < Formula
  homepage 'http://www.imagemagick.org'

  # upstream's stable tarballs tend to disappear, so we provide our own mirror
  url 'http://downloads.sf.net/project/machomebrew/mirror/ImageMagick-6.7.7-6.tar.bz2'
  sha256 'fb32cdeef812bc2c3bb9e9f48f3cfc75c1e2640f784ef2670a0dbf948e538677'

  head 'https://www.imagemagick.org/subversion/ImageMagick/trunk',
    :using => UnsafeSubversionDownloadStrategy

  option 'with-ghostscript', 'Compile against ghostscript (not recommended.)'
  option 'use-tiff', 'Compile with libtiff support.'
  option 'use-cms', 'Compile with little-cms support.'
  option 'use-jpeg2000', 'Compile with jasper support.'
  option 'use-wmf', 'Compile with libwmf support.'
  option 'use-rsvg', 'Compile with librsvg support.'
  option 'use-lqr', 'Compile with liblqr support.'
  option 'use-exr', 'Compile with openexr support.'
  option 'enable-openmp', 'Enable OpenMP (not supported on Leopard or with Clang).'
  option 'disable-opencl', 'Disable OpenCL.'
  option 'enable-hdri', 'Compile with HDRI support enabled'
  option 'without-magick-plus-plus', "Don't compile C++ interface."
  option 'with-quantum-depth-8', 'Compile with a quantum depth of 8 bit'
  option 'with-quantum-depth-16', 'Compile with a quantum depth of 16 bit'
  option 'with-quantum-depth-32', 'Compile with a quantum depth of 32 bit'
  option 'with-x', 'Compile with X11 support.'
  option 'without-freetype', 'Compile without freetype support.'

  depends_on 'pkg-config' => :build

  depends_on 'jpeg' => :recommended
  depends_on :libpng
  depends_on :x11 if build.include? 'with-x'
  depends_on :freetype => :recommended unless build.include? 'without-freetype'

  depends_on 'ghostscript' => :optional if ghostscript_srsly?

  depends_on 'libtiff' => :optional if build.include? 'use-tiff'
  depends_on 'little-cms' => :optional if build.include? 'use-cms'
  depends_on 'jasper' => :optional if build.include? 'use-jpeg2000'
  depends_on 'libwmf' => :optional if build.include? 'use-wmf'
  depends_on 'librsvg' => :optional if build.include? 'use-rsvg'
  depends_on 'liblqr' => :optional if build.include? 'use-lqr'
  depends_on 'openexr' => :optional if build.include? 'use-exr'

  bottle do
    version 3
    sha1 '0d7ca4e54a1d3090e8b5a85663f0efa857ea52b7' => :mountainlion
    sha1 '64fca6d7c75407dd1942a271a4df837ab02bbeb0' => :lion
    sha1 'b8d1a9b2de7b1961da311df77922d326c2b6723f' => :snowleopard
  end

  skip_clean :la

  def patches
    # Fixes xml2-config that can be missing --prefix.  See issue #11789
    # Remove if the final Mt. Lion xml2-config supports --prefix.
    # Not reporting this upstream until the final Mt. Lion is released.
    DATA
  end

  def install
    args = [ "--disable-osx-universal-binary",
             "--without-perl", # I couldn't make this compile
             "--prefix=#{prefix}",
             "--disable-dependency-tracking",
             "--enable-shared",
             "--disable-static",
             "--without-pango",
             "--with-included-ltdl",
             "--with-modules"]

    args << "--disable-openmp" unless build.include? 'enable-openmp'
    args << "--disable-opencl" if build.include? 'disable-opencl'
    args << "--without-gslib" unless build.include? 'with-ghostscript'
    args << "--with-gs-font-dir=#{HOMEBREW_PREFIX}/share/ghostscript/fonts" \
                unless ghostscript_srsly? or ghostscript_fonts?
    args << "--without-magick-plus-plus" if build.include? 'without-magick-plus-plus'
    args << "--enable-hdri=yes" if build.include? 'enable-hdri'

    if build.include? 'with-quantum-depth-32'
      quantum_depth = 32
    elsif build.include? 'with-quantum-depth-16'
      quantum_depth = 16
    elsif build.include? 'with-quantum-depth-8'
      quantum_depth = 8
    end

    args << "--with-quantum-depth=#{quantum_depth}" if quantum_depth
    args << "--with-rsvg" if build.include? 'use-rsvg'
    args << "--without-x" unless build.include? 'with-x'
    args << "--with-freetype=yes" if build.include? 'with-freetype'

    # versioned stuff in main tree is pointless for us
    inreplace 'configure', '${PACKAGE_NAME}-${PACKAGE_VERSION}', '${PACKAGE_NAME}'
    system "./configure", *args
    system "make install"
  end

  def caveats
    unless ghostscript_fonts? or ghostscript_srsly?
      <<-EOS.undent
      Some tools will complain unless the ghostscript fonts are installed to:
        #{HOMEBREW_PREFIX}/share/ghostscript/fonts
      EOS
    end
  end

  def test
    system "#{bin}/identify", \
      "/System/Library/Frameworks/SecurityInterface.framework/Versions/A/Resources/Key_Large.png"
  end
end

__END__
--- a/configure	2012-02-25 09:03:23.000000000 -0800
+++ b/configure	2012-04-26 03:32:15.000000000 -0700
@@ -31924,7 +31924,7 @@
         # Debian installs libxml headers under /usr/include/libxml2/libxml with
         # the shared library installed under /usr/lib, whereas the package
         # installs itself under $prefix/libxml and $prefix/lib.
-        xml2_prefix=`xml2-config --prefix`
+        xml2_prefix=/usr
         if test -d "${xml2_prefix}/include/libxml2"; then
             CPPFLAGS="$CPPFLAGS -I${xml2_prefix}/include/libxml2"
         fi
