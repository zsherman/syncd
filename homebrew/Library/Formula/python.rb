require 'formula'

class TkCheck < Requirement
  def message; <<-EOS.undent
    Tk.framework was detected in /Library/Frameworks
    This can cause Python builds to fail. See:
      https://github.com/mxcl/homebrew/issues/11602
    EOS
  end

  def fatal?; false; end

  def satisfied?
    not File.exist? '/Library/Frameworks/Tk.framework'
  end
end

class Distribute < Formula
  url 'http://pypi.python.org/packages/source/d/distribute/distribute-0.6.28.tar.gz'
  sha1 '709bd97d46050d69865d4b588c7707768dfe6711'
end

class Pip < Formula
  url 'http://pypi.python.org/packages/source/p/pip/pip-1.2.tar.gz'
  sha1 '7876f943cfbb0bbb725c2761879de2889c1fe93b'
end

class Python < Formula
  homepage 'http://www.python.org/'
  url 'http://www.python.org/ftp/python/2.7.3/Python-2.7.3.tar.bz2'
  sha1 '842c4e2aff3f016feea3c6e992c7fa96e49c9aa0'

  env :std

  depends_on TkCheck.new
  depends_on 'pkg-config' => :build
  depends_on 'readline' => :recommended
  depends_on 'sqlite' => :recommended
  depends_on 'gdbm' => :recommended
  depends_on :x11 # tk.h includes X11/Xlib.h and X11/X.h

  option :universal
  option 'quicktest', 'Run `make quicktest` after the build'

  # --with-dtrace relies on CLT as the patch from
  # http://bugs.python.org/issue13405 requires it.
  # A note is added upstream about the CLT requirement.
  option 'with-dtrace', 'Install with DTrace support' if MacOS::CLT.installed?

  def site_packages_cellar
    prefix/"Frameworks/Python.framework/Versions/2.7/lib/python2.7/site-packages"
  end

  def patches
    'https://raw.github.com/gist/3415636/2365dea8dc5415daa0148e98c394345e1191e4aa/pythondtrace-patch.diff'
  end if build.include? 'with-dtrace'

  # The HOMEBREW_PREFIX location of site-packages.
  def site_packages
    HOMEBREW_PREFIX/"lib/python2.7/site-packages"
  end

  # Where distribute/pip will install executable scripts.
  def scripts_folder
    HOMEBREW_PREFIX/"share/python"
  end

  def effective_lib
    prefix/"Frameworks/Python.framework/Versions/2.7/lib"
  end

  def install
    # Unset these so that installing pip and distribute puts them where we want
    # and not into some other Python the user has installed.
    ENV['PYTHONPATH'] = nil
    ENV['PYTHONHOME'] = nil

    args = %W[
             --prefix=#{prefix}
             --enable-ipv6
             --datarootdir=#{share}
             --datadir=#{share}
             --enable-framework=#{prefix}/Frameworks
           ]

    args << '--without-gcc' if ENV.compiler == :clang
    args << '--with-dtrace' if build.include? 'with-dtrace'

    # Further, Python scans all "-I" dirs but not "-isysroot", so we add
    # the needed includes with "-I" here to avoid this err:
    #     building dbm using ndbm
    #     error: /usr/include/zlib.h: No such file or directory
    ENV.append 'CPPFLAGS', "-I#{MacOS.sdk_path}/usr/include" unless MacOS::CLT.installed?

    # Don't use optimizations other than "-Os" here, because Python's distutils
    # remembers (hint: `python-config --cflags`) and reuses them for C
    # extensions which can break software (such as scipy 0.11 fails when
    # "-msse4" is present.)
    ENV.minimal_optimization

    # We need to enable warnings because the configure.in uses -Werror to detect
    # "whether gcc supports ParseTuple" (https://github.com/mxcl/homebrew/issues/12194)
    ENV.enable_warnings
    if ENV.compiler == :clang
      # http://docs.python.org/devguide/setup.html#id8 suggests to disable some Warnings.
      ENV.append_to_cflags '-Wno-unused-value'
      ENV.append_to_cflags '-Wno-empty-body'
      ENV.append_to_cflags '-Qunused-arguments'
    end

    if build.universal?
      args << "--enable-universalsdk=/" << "--with-universal-archs=intel"
    end

    # Allow sqlite3 module to load extensions:
    # http://docs.python.org/library/sqlite3.html#f1
    inreplace "setup.py", 'sqlite_defines.append(("SQLITE_OMIT_LOAD_EXTENSION", "1"))', ''

    system "./configure", *args

    # HAVE_POLL is "broken" on OS X
    # See: http://trac.macports.org/ticket/18376
    inreplace 'pyconfig.h', /.*?(HAVE_POLL[_A-Z]*).*/, '#undef \1'

    system "make"
    ENV.deparallelize # Installs must be serialized
    # Tell Python not to install into /Applications (default for framework builds)
    system "make", "install", "PYTHONAPPSDIR=#{prefix}"
    # Demos and Tools into HOMEBREW_PREFIX/share/python
    system "make", "frameworkinstallextras", "PYTHONAPPSDIR=#{share}/python"
    system "make", "quicktest" if build.include? 'quicktest'

    # Post-install, fix up the site-packages and install-scripts folders
    # so that user-installed Python software survives minor updates, such
    # as going from 2.7.0 to 2.7.1:

    # Remove the site-packages that Python created in its Cellar.
    site_packages_cellar.rmtree
    # Create a site-packages in HOMEBREW_PREFIX/lib/python/site-packages
    site_packages.mkpath
    # Symlink the prefix site-packages into the cellar.
    ln_s site_packages, site_packages_cellar

    # Tell distutils-based installers where to put scripts
    scripts_folder.mkpath
    (effective_lib+"python2.7/distutils/distutils.cfg").write <<-EOF.undent
      [install]
      install-scripts=#{scripts_folder}
    EOF

    # Install distribute and pip
    Distribute.new.brew { system "#{bin}/python", "setup.py", "--no-user-cfg", "install", "--force", "--verbose" }
    Pip.new.brew { system "#{bin}/python", "setup.py", "--no-user-cfg", "install", "--force", "--verbose" }
  end

  def caveats
    <<-EOS.undent
      The Python framework is located at
        #{prefix}/Frameworks/Python.framework

      You can find the Python demo at
        #{HOMEBREW_PREFIX}/share/python/Extras

      You can `brew linkapps` to symlink "Idle" and the "Python Launcher".

      A "distutils.cfg" has been written, specifying the install-scripts folder as:
        #{scripts_folder}

      If you install Python packages via "pip install x" or "python setup.py install"
      (or the outdated easy_install), any provided scripts will go into the
      install-scripts folder above, so you may want to add it to your PATH.

      The site-package directory for brewed Python:
        #{site_packages}

      Distribute and Pip have been installed. To update them
        #{scripts_folder}/pip install --upgrade distribute
        #{scripts_folder}/pip install --upgrade pip

      See: https://github.com/mxcl/homebrew/wiki/Homebrew-and-Python
    EOS
  end

  def test
    # Check if sqlite is ok, because we build with --enable-loadable-sqlite-extensions
    # and it can occur that building sqlite silently fails if OSX's sqlite is used.
    system "#{bin}/python", "-c", "import sqlite3"
    # See: https://github.com/mxcl/homebrew/pull/10487
    # Fixed [upstream](http://bugs.python.org/issue11149), but still nice to have.
    `#{bin}/python -c 'from decimal import Decimal; print Decimal(4) / Decimal(2)'`.chomp == '2'
  end
end
