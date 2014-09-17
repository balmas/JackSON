require 'minitest/autorun'
require 'benchmark'
require 'rest_client'
require 'json'
require_relative '../JackHELP.rb'

# Want to run a single test?
# You probably do when developing.
# ruby test_JackSON.rb --name test_AAA_post

class JackTEST < Minitest::Test
  
  # Big bold HTTP method constants.
  # Better reminders?
  POST = 'POST'
  GET = 'GET'
  PUT = 'PUT'
  DELETE = 'DELETE'
  
  def self.test_order
    :alpha
  end
  
  # Helper methods.
  private 
  
  def url( rel )
    "http://localhost:4567/data/#{rel}"
  end
  
  def hashit( file )
    return {} if file ==nil
    file = JackHELP.run.json_file( File.dirname(__FILE__), file )
    JSON.parse( File.read( file ) )
  end
  
  def hashttp( file )
    { :data => hashit( file ) }
  end
  
  def api( method, path, file=nil )
    r = nil
    path = url( path )
    file = hashttp( file )
    case method.upcase
    when POST
      r = RestClient.post path, file
    when PUT
      r = RestClient.put path, file
    when GET
      r = RestClient.get path
    when DELETE
      r = RestClient.delete path, file
    end
    JSON.parse( r )
  end
  
  def success?( hash )
    hash.include?("success")
  end
  
end