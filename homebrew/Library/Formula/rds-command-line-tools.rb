require 'formula'

class RdsCommandLineTools < AmazonWebServicesFormula
  homepage 'http://aws.amazon.com/developertools/2928'
  url 'http://s3.amazonaws.com/rds-downloads/RDSCli.zip'
  version '1.9.002'
  sha1 'f718bf2288461b0d2bc9b9479af1afdabecce4d6'

  def install
    standard_install
  end

  def caveats
    s = standard_instructions "AWS_RDS_HOME"
    s += <<-EOS.undent

      To check that your setup works properly, run the following command:
        rds-describe-db-instances --headers

      You should see a header line. If you have database instances already configured,
      you will see a description line for each database instance.
    EOS
    return s
  end
end
