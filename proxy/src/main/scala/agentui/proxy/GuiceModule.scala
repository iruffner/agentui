package agentui.proxy

import net.codingwell.scalaguice.ScalaModule
import com.google.inject.Provider
import net.model3.guice.M3GuiceModule
import com.google.inject.util.Modules
import com.google.inject.Module
import m3.servlet.M3ServletModule
import m3.servlet.CurlFilter
import net.model3.guice.bootstrap.ApplicationName



class GuiceModule extends ScalaModule with Provider[Module] {

  def get = Modules.`override` (
      new M3GuiceModule()
  ).`with`(
      this,
      ServletModule
  )

  def configure = {
    bind(classOf[ApplicationName]).toInstance(new ApplicationName("agentui"))
  }

  object ServletModule extends M3ServletModule {
    override def configureServlets = {
      init
      filter("/api").through(classOf[CurlFilter])
//      serve("/post").`with`(classOf[ProxyServlet])
//      serve("/sessionPing").`with`(classOf[ProxyServlet])
      serve("/api").`with`(classOf[ProxyServlet])
      
    } 
  }
  
}
