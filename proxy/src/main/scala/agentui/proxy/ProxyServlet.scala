package agentui.proxy

import javax.servlet.http.HttpServlet
import com.google.inject.Singleton
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse
import org.apache.http.impl.client.DefaultHttpClient
import org.apache.http.client.methods.HttpPost
import net.model3.io.Pipe
import scala.collection.JavaConverters._
import m3.predef._
import net.model3.io.IOHelper
import org.apache.http.entity.ByteArrayEntity
import net.model3.newfile.File
import net.model3.lang.TimeDuration
import scala.annotation.tailrec
import net.model3.chrono.DateTime

/**
 * A very simple proxy servlet to get us going.  There are too many places where this is just brutish and 
 * has no finesse to list.
 * 
 * Suffice to say we will add finesse as needed.  This is to allow localhost dev while using a server on the internet to 
 * handle certain calls while avoiding cross domain scripting issues.
 * 
 */
@Singleton
class ProxyServlet extends HttpServlet with Logging {
  
  val ignoreRequestHeaders = Set(
    "Content-Length",
    "Host"
  )
  
  val timeoutInSeconds = 60
  val configFile = new File("proxy-server.conf")

  def loadConfig = {
    if ( configFile.exists ) {
      val text = 
        configFile.
          readText.
          trim.
          lines.
          map(_.trim).
          filterNot(_.startsWith("#")).
          filter(_.length > 0).
          mkString
      logger.debug(s"loaded proxy server -- ${text} -- from config file ${configFile.getCanonicalPath}")
      text
    } else {
      throw new RuntimeException("unable to find config file " + configFile.getCanonicalPath)
    }
  }

  def reloadConfig(lastConfigLoad: DateTime): Option[(String,DateTime)] = {
    try {
      val lastModified = configFile.getLastModified
      if ( lastModified != lastConfigLoad ) Some(loadConfig -> lastModified)
      else None
    } catch {
      case th: Throwable => {
        logger.error(th)
        None
      }
    }
  }

  @volatile var proxyServerUrl = loadConfig

  override def init = {
    logger.debug("init")
    val configReloadSleep = new TimeDuration("2 seconds")
    spawn("config-reloader") {
      @tailrec def loop(lastConfigLoad: DateTime): Unit = {
        val next = reloadConfig(lastConfigLoad) match {
          case Some((url, lastChanged)) => {
            proxyServerUrl = url
            lastChanged
          }
          case None => lastConfigLoad
        }
        configReloadSleep.sleep
        loop(next)
      }
      loop(new DateTime(0))
    }
  }

  override def doPost(req: HttpServletRequest, resp: HttpServletResponse) = {
    
    logger.debug("received request " + req.getRequestURL)

    val client = new DefaultHttpClient()
    try {
      
      client.getParams().setParameter("http.socket.timeout", timeoutInSeconds * 1000);
      client.getParams().setParameter("http.connection.timeout", timeoutInSeconds * 1000);
      client.getParams().setParameter("http.connection-manager.timeout", new java.lang.Long(timeoutInSeconds * 1000));
      client.getParams().setParameter("http.protocol.head-body-timeout", timeoutInSeconds * 1000);

      //calpop
//      val post = new HttpPost("http://ec2-54-214-55-27.us-west-2.compute.amazonaws.com:9876/api")      
      //their aws test server
//      val post = new HttpPost("http://ec2-54-212-15-76.us-west-2.compute.amazonaws.com:9876/api")
      //model3 aws test server
//      val post = new HttpPost("http://ec2-54-214-229-124.us-west-2.compute.amazonaws.com:9876/api")
      
      val post = new HttpPost(proxyServerUrl) 

      req.getHeaderNames.asScala.filterNot(ignoreRequestHeaders).foreach { header =>
        post.setHeader(header, req.getHeader(header))
      }
      
      val reqBody = IOHelper.readFully(req.getInputStream)
      
//      req.getParameterNames().asScala.foreach { parm =>
//        post.getParams.setParameter(parm, req.getParameter(parm))  
//      }
      post.setEntity(new ByteArrayEntity(reqBody))

//      logger.debug("proxying to upstream server")
      val response = client.execute(post)

      response.getAllHeaders().foreach { header =>
        resp.setHeader(header.getName, header.getValue)
      }

      val sl = response.getStatusLine
      resp.setStatus(sl.getStatusCode)

      val in = response.getEntity.getContent
      logger.debug("piping response to client")
      new Pipe(in, resp.getOutputStream).run
      logger.debug("request complete")
      
    } catch {
      case e: Throwable => logger.error(e)
    } finally {
    }
    
  }

}