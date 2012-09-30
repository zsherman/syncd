require 'formula'

class Flann < Formula
  homepage 'http://www.cs.ubc.ca/~mariusm/index.php/FLANN/FLANN'
  url 'http://people.cs.ubc.ca/~mariusm/uploads/FLANN/flann-1.7.1-src.zip'
  sha1 '61b9858620528919ea60a2a4b085ccc2b3c2d138'

  option 'enable-python', 'Enable python bindings'
  option 'enable-matlab', 'Enable matlab/octave bindings'
  option 'with-examples', 'Build and install example binaries'

  depends_on 'cmake' => :build
  depends_on 'hdf5'

  depends_on 'octave' if build.include? 'enable-matlab'
  depends_on 'numpy' => :python if build.include? 'enable-python'

  def install
    args = std_cmake_args
    if build.include? 'enable-matlab'
      args << '-DBUILD_MATLAB_BINDINGS:BOOL=ON'
    else
      args << '-DBUILD_MATLAB_BINDINGS:BOOL=OFF'
    end

    if build.include? 'enable-python'
      args << '-DBUILD_PYTHON_BINDINGS:BOOL=ON'
    else
      args << '-DBUILD_PYTHON_BINDINGS:BOOL=OFF'
    end

    inreplace 'CMakeLists.txt', 'add_subdirectory( examples )', '' unless build.include? 'with-examples'

    mkdir 'build'
    cd 'build' do
      system 'cmake', '..', *args
      system 'make install'
    end
  end
end
