package agentui.digress

import java.net.URL
import net.model3.logging.SimpleLoggingConfigurator
import m3.Logger
import org.apache.http.impl.client.DefaultHttpClient
import org.apache.http.client.methods.HttpPost
import org.apache.http.entity.StringEntity
import net.model3.io.IOHelper
import java.io.InputStreamReader
import net.liftweb.json._
import m3.predef._
import net.model3.collections.PropertiesX
import scala.collection.JavaConverters._

object Digress extends App {


  new SimpleLoggingConfigurator().addEclipseConsoleAppender()

  val logger = Logger.getLogger

  val apiUrl = "http://calpop:9876/api"

  val httpClient = new DefaultHttpClient

  def post(parms: Map[String,String], reqBody: String) = {
    val httpPost = new HttpPost(apiUrl)
    val reqBodyWithParms = PropertiesX.processStringForVariables(parms.asJava, reqBody, true)
    httpPost.setEntity(new StringEntity(reqBodyWithParms))
    val httpResp = httpClient.execute(httpPost)
    val resp = IOHelper.readFully(new InputStreamReader(httpResp.getEntity.getContent))
    net.liftweb.json.parse(resp)
  }

  val resp_0 = post(Map(), """
{
  "msgType": "initializeSessionRequest", 
  "content": { 
    "agentURI": "agent://George.Costanza:Bosco@server:9876/TheAgency" 
  } 
}
""")

  val sessionUri = (resp_0 \\ "sessionURI") match {
    case JsonAST.JString(s) => s
    case _ => sys.error("bad json, bad!!")
  }
  
  val parms = Map("sessionURI" -> sessionUri)

  logger.info("using sessionUri = {}", sessionUri)
  
  logger.info("===== standard ping-o-rama =====")
  post(parms, """
{
  "msgType": "sessionPing",
  "content": { 
    "sessionURI":"${sessionURI}" 
  }
}
""")

  logger.info("===== do something interesting like an evalSubscribeRequest =====")
  post(parms, """
{
  "msgType":"evalSubscribeRequest", 
  "content": { 
    "sessionURI":"${sessionURI}", 
    "expression": "foo(bar,baz)" 
  } 
}
""")

  logger.info("===== close session request =====")
  post(parms, """
{
  "msgType": "closeSessionRequest",
  "content": { 
    "sessionURI":"${sessionURI}" 
  } 
}      
""")



}

