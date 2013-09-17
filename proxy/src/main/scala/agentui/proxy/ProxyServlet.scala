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
  
  val configFile = new File("proxy-server.conf")

  var lastConfigLoad = 0L
  @volatile var proxyServerUrl = "http://ec2-54-214-229-124.us-west-2.compute.amazonaws.com:9876/api"

  override def init = {
    logger.debug("init")
    spawn("config-reloader") {
      @tailrec def loop(lastConfigLoad: Long): Unit = {
        loop( 
          try {
            val nextLcl = if ( configFile.exists ) {
              val lastModified = configFile.getLastModified.asDate.getTime
              if ( lastModified != lastConfigLoad ) {
                proxyServerUrl = configFile.readText
                logger.debug(s"using proxyServerUrl = ${proxyServerUrl}")
              }
              lastModified
            } else {
              lastConfigLoad
            }
            new TimeDuration("2 seconds").sleep
            nextLcl
          } catch {
            case th: Throwable => {
              logger.error(th)
              lastConfigLoad
            }
          }
        )
      }
      loop(-1)
    }
  }

  override def doPost(req: HttpServletRequest, resp: HttpServletResponse) = {
    
    logger.debug("received request " + req.getRequestURL)

    try {
      val client = new DefaultHttpClient()
      //calpop
//      val post = new HttpPost("http://ec2-54-214-55-27.us-west-2.compute.amazonaws.com:9876/api")
      
      //their aws test server
//      val post = new HttpPost("http://ec2-54-212-15-76.us-west-2.compute.amazonaws.com:9876/api")
      //model3 aws test server
      val post = new HttpPost("http://ec2-54-214-229-124.us-west-2.compute.amazonaws.com:9876/api") 
//      val post = new HttpPost("http://64.27.3.17:9876/api")

      req.getHeaderNames.asScala.filterNot(ignoreRequestHeaders).foreach { header =>
        post.setHeader(header, req.getHeader(header))
      }
      
      val reqBody = IOHelper.readFully(req.getInputStream)
      
//      req.getParameterNames().asScala.foreach { parm =>
//        post.getParams.setParameter(parm, req.getParameter(parm))  
//      }
      post.setEntity(new ByteArrayEntity(reqBody))

      logger.debug("proxying to upstream server")
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
    }
    
  }

}