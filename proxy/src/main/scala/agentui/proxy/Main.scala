package agentui.proxy

import net.model3.servlet.runner.JettyRunner
import net.model3.logging.SimpleLoggingConfigurator
import net.model3.guice.DependencyInjector
import m3.GuiceApp
import net.model3.logging.LoggerHelper
import net.model3.logging.Level




object Main extends App {
  
  DependencyInjector.set(new GuiceModule().get)

  LoggerHelper.getLogger("org.apache.http").setLevel(Level.INFO)
  LoggerHelper.getLogger("org.apache.http.wire").setLevel(Level.DEBUG)
  
  new SimpleLoggingConfigurator().addEclipseConsoleAppender()
  
  JettyRunner.main(args)
  
}
