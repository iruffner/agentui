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

  override def doPost(req: HttpServletRequest, resp: HttpServletResponse) = {
    
    try {
      val client = new DefaultHttpClient()
      val post = new HttpPost("http://64.27.3.17:9876/post")

      req.getHeaderNames.asScala.filterNot(ignoreRequestHeaders).foreach { header =>
        post.setHeader(header, req.getHeader(header))
      }
      
      val reqBody = IOHelper.readFully(req.getInputStream)
      
//      req.getParameterNames().asScala.foreach { parm =>
//        post.getParams.setParameter(parm, req.getParameter(parm))  
//      }
      post.setEntity(new ByteArrayEntity(reqBody))

      val response = client.execute(post)

      response.getAllHeaders().foreach { header =>
        resp.setHeader(header.getName, header.getValue)
      }

      val in = response.getEntity.getContent
      new Pipe(in, resp.getOutputStream).run
    } catch {
      case e => logger.error(e)
    }
    
  }

}